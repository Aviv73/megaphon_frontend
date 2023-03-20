<template>
  <li class="shoppingList-preview item-preview flex column gap10">
    <div class="header flex align-center space-between">
      <p v-if="!showActions">{{shoppingListToEdit.title}}</p>
      <FormInput v-else v-model="shoppingListToEdit.title" placeholder="title"/>
      <div class="flex gap5">
        <button @click="removeShoppingList" class="btn icon" v-if="showActions"><img :src="require('@/assets/images/garbage.png')"/></button>
        <button @click="toggleItemsView(!itemsView)" class="btn icon"><img :src="require(`@/assets/images/${itemsView? '' : 'check-'}list.png`)"/></button>
        <button @click="toggleShowActions(!showActions)" class="btn icon"><img :src="require('@/assets/images/pencil.png')"/></button>
      </div>
    </div>
    <div v-if="itemsView" class="flex column gap20">
      <p>{{$t('products')}}</p>
      <ul class="width-all flex column gap5">
        <li v-for="item in shoppingListToEdit.products" :key="item.id" class="flex gap5 space-between">
          <div class="flex align-center gap5">
            <button @click="updateProductIdx(item.id, -1)" class="btn small icon"><img :src="require('@/assets/images/small-arrow-head-up.png')"/></button>
            <button @click="updateProductIdx(item.id, 11)" class="btn small icon"><img :src="require('@/assets/images/small-arrow-head-down.png')"/></button>
            <p class="flex-1">{{item.name}}:</p>
          </div>
          <div class="flex align-center gap5">
            <div class="flex align-center gap5">
              <button @click="item.count++" class="btn small">+</button>
              <FormInput :min="0" type="number" placeholder="count" v-model="item.count"/>
              <button :disabled="(+item.count <= 0)" @click="item.count--" class="btn small">-</button>
            </div>
            <div v-if="showActions" class="flex align-center gap5">
              <button @click="removeProduct(item.id)" class="btn icon"><img :src="require('@/assets/images/garbage.png')"/></button>
              <button @click="setProductToEdit(item)" class="btn icon"><img :src="require('@/assets/images/pencil.png')"/></button>
            </div>
          </div>
        </li>
      </ul>
      <div class="new-product-section flex column gap15">
        <div class="flex align-center space-between">
          <button @click="toggleAddProductSection(!showAddProductSection)">
            {{$t(showAddProductSection? 'close' : 'addProduct')}}
          </button>
          <button v-if="showAddProductSection" @click="saveNewProduct()" class="btn icon"><img :src="require('@/assets/images/save.png')"/></button>
        </div>
        <div v-if="showAddProductSection" class="new-product-section flex column gap10">
          <div class="flex column gap5">
            <FormInput type="text" placeholder="title" v-model="productToEdit.name"/>
            <FormInput type="number" placeholder="count" label="count" v-model="productToEdit.count"/>
            <FormInput type="number" :min="0" placeholder="minCount" label="minCount" v-model="productToEdit.minCount"/>
            <FormInput type="number" :min="0" placeholder="maxCount" label="maxCount" v-model="productToEdit.maxCount"/>
          </div>
          <div class="flex column gap10">
            <p>{{$t('prices')}}</p>
            <ul class="flex column gap10">
              <li v-for="(price, i) in productToEdit.prices" :key="price.id" class="flex space-between align-end">
                <FormInput type="text" placeholder="shopName" v-model="price.shopName"/>
                <FormInput type="number" :min="0" placeholder="price" v-model="price.value"/>
                <button @click="productToEdit.prices.splice(i, 1)" class="btn icon"><img :src="require('@/assets/images/garbage.png')"/></button>
              </li>
              <li>
                <button @click="addPrice">
                  {{$t('addPrice')}}
                </button>
              </li>
            </ul>
          </div>
          <button @click="saveNewProduct()">{{$t('save')}}</button>
        </div>
      </div>
    </div>
    <div v-else class="flex column gap10 space-between height-all">
      <template v-if="shoppingItemsToRender.length">
        <div class="flex column gap20">
          <nav class="flex space-between wrap">
            <button @click="viewdShop = shop" v-for="shop in shopViewData.shops" :key="shop">{{shop}}</button>
          </nav>
          <ul class="flex column gap10">
            <li v-for="item in shoppingItemsToRender" :key="item.id" class="flex space-between">
              <p class="flex align-center gap5"><FormInput type="checkbox" @click.native="val => toggleItemToCart(item.id, val)" :value="isProdactInCart(item.id)"/> {{item.toByCount}} {{item.name}}</p>
              <p>{{item.totalPrice}}</p>
            </li>
          </ul>
          <p class="flex space-between"><span>{{$t('total')}}:</span> <span>{{totalPrice}}</span></p>
        </div>
        <button @click="settleUpCatr">{{$t('settleUp')}}</button>
      </template>
      <template v-else>
        <p>{{$t('allSettledUp')}}!</p>
      </template>
    </div>
  </li>
</template>

<script>
import FormInput from '@/modules/common/cmps/FormInput.vue';
import { shoppingListService } from '../services/shoppingList.service';
import { socketService } from '@/modules/common/services/socket.service';
import { alertService } from '@/modules/common/services/alert.service';

export default {
  name: 'ShoppingListPreview',
  props: {
    item: {
      type: Object,
      required: true,
      dontEmit: false
    }
  },
  data() {
    return {
      showAddProductSection: false,
      showActions: false,
      itemsView: true,
      shoppingListToEdit: null,
      productToEdit: shoppingListService.getEmptyShoppingProduct(),
      
      viewdShop: '',
    }
  },
  computed: {
    shoppingList() {
      return this.item;
    },
    orgId() {
      return this.$route.params.organizationId;
    },

    shopViewData() {
      return {
        shops: Array.from(new Set(this.shoppingList.products.reduce((acc, c) => [...acc, ...c.prices.map(i => i.shopName)], [])))
                .sort((a, b) => {
                  const priceA = this.calcTotalPricePerShop(a);
                  const priceB = this.calcTotalPricePerShop(b);
                  if (priceA === 'unknown') return 1;
                  if (priceB === 'unknown') return -1;
                  return priceA - priceB;
                }),
        products: this.shoppingList.products
      }
    },
    shoppingItemsToRender() {
      return this.calcShoppingItemsDataPerShop(this.viewdShop);
    },
    totalPrice() {
      return this.calcTotalPricePerShop(this.viewdShop);
    }
  },
  methods: {
    toggleAddProductSection(val) {
      this.showAddProductSection = val
    },
    toggleShowActions(val) {
      this.showActions = val;
    },
    toggleItemsView(val) {
      this.itemsView = val;
      if (!val) {
        if (!this.viewdShop) this.viewdShop = this.shopViewData.shops[0] || '';
      }
    },

    addPrice() {
      this.productToEdit.prices.push(shoppingListService.getEmptyPrice());
    },
    saveNewProduct() {
      const idx = this.shoppingListToEdit.products.findIndex(c => c.id === this.productToEdit.id);
      if (idx === -1) this.shoppingListToEdit.products.push(this.productToEdit);
      else this.shoppingListToEdit.products.splice(idx, 1, this.productToEdit);
      this.productToEdit = shoppingListService.getEmptyShoppingProduct();
      this.toggleAddProductSection(false);
    },
    async removeProduct(id) {
      if (!await alertService.Confirm('Are you sure you want to remove this product?')) return;
      const idx = this.shoppingListToEdit.products.findIndex(c => c.id === id);
      this.shoppingListToEdit.products.splice(idx, 1);
    },
    setProductToEdit(product) {
      this.productToEdit = JSON.parse(JSON.stringify(product));
      this.toggleAddProductSection(true);
    },

    setEditItem() {
      this.dontEmit = true;
      this.shoppingListToEdit = JSON.parse(JSON.stringify(this.shoppingList));
      this.dontEmit = false;
    },

    onSocketUpdateShoppongList({ shoppingList }) {
      this.dontEmit = true;
      this.shoppingListToEdit = null;
      this.$store.commit({ type: 'shoppingList/saveShoppingList', shoppingList });
      this.dontEmit = false;
      // this.setEditItem()
    },


    calcShoppingItemsDataPerShop(shop) {
      return this.shoppingList.products.filter(c => c.count <= c.minCount).map(c => {
        const price = c.prices.find(i => i.shopName === shop)?.value || 'unknown';
        const toByCount = c.maxCount - c.count;
        return {
          id: c.id,
          name: c.name,
          price,
          toByCount,
          totalPrice: price === 'unknown' ? price : price*toByCount
        }
      });
    },
    calcTotalPricePerShop(shop) {
      const currPrices = this.calcShoppingItemsDataPerShop(shop).map(c => c.totalPrice);
      if (currPrices.includes('unknown')) return 'unknown';
      return currPrices.reduce((sum, c) => sum+c, 0);
    },

    toggleItemToCart(prodartId, val) {
      const idx = this.shoppingListToEdit.cart.findIndex(c => c === prodartId);
      if (idx === -1) this.shoppingListToEdit.cart.push(prodartId);
      else this.shoppingListToEdit.cart.splice(idx, 1);
    },
    isProdactInCart(id) {
      return this.shoppingList.cart.includes(id);
    },
    settleUpCatr() {
      this.shoppingListToEdit.products.forEach(c => {
        if (this.isProdactInCart(c.id)) c.count = c.maxCount
      });
      this.shoppingListToEdit.cart = [];
    },

    removeShoppingList() {
      this.$store.dispatch({type: 'shoppingList/removeShoppingList', id: this.shoppingListToEdit._id, organizationId: this.orgId });
    },

    updateProductIdx(id, diff) {
      const idx = this.shoppingListToEdit.products.findIndex(c => c.id === id);
      let newIdx = idx + diff;
      if (newIdx < 0) newIdx = this.shoppingListToEdit.products.length-1-newIdx;
      else if (newIdx >= this.shoppingListToEdit.products.length) newIdx = newIdx - this.shoppingListToEdit.products.length;
      const item = this.shoppingListToEdit.products.splice(idx, 1)[0];
      this.shoppingListToEdit.products.splice(newIdx, 0, item);
    }
  },
  created() {
    this.setEditItem();
    socketService.on('update-shoppingList-' + this.shoppingList._id, this.onSocketUpdateShoppongList);
  },
  destroyed() {
    socketService.off('update-shoppingList-' + this.shoppingList._id, this.onSocketUpdateShoppongList);
  },
  watch: {
    shoppingListToEdit: {
      deep: true,
      async handler(curr, prev) {
        if (!prev || !curr) return;
        if (this.dontEmit) return;
        if (JSON.stringify(prev) === JSON.stringify(this.shoppingList)) return;
        await this.$store.dispatch({type: 'shoppingList/saveShoppingList', shoppingList: this.shoppingListToEdit, organizationId: this.orgId });
        // this.setEditItem();
      }
    },
    shoppingList: {
      deep: true,
      async handler() {
        this.setEditItem();
      }
    }
  },
  components: { FormInput }
}
</script>

<style lang="scss">
.shoppingList-preview {
  .header {
    height: 30px;
  }
  // min-height: 350px !important;
  overflow: unset !important;
  height: unset !important;
  // min-height: 500px;
  .form-input {
    .input.number {
      width: 40px;
    }
  }
  .new-product-section {
    .form-input {
      justify-content: space-between;
    }
  }
}
</style>