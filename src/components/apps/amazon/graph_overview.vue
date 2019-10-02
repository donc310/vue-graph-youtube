<template>
  <div>
    <div class="graph-overview col shadow toolbar-transition">
      <div class="header">
        <h2>
          Found
          <span class="accent">{{computedProductCount}}</span> products
          <a
            href="#"
            @click="hideDetails($event)"
            class="close-panel"
            title="collapse this list"
          >
            <i class="material-icons">close</i>
          </a>
        </h2>
        <div class="row">
          <div>Sort</div>
          <div class="drop-click-container sort-method">
            <span class="drop-click-name" title="Popularity">by {{sortValue}}</span>
            <select v-model="sortValue" class="back-dropdown">
              <option
                v-for="(option ,index) in computedSortOption"
                :key="index"
                :value="option.value"
              >{{option.desc}}</option>
            </select>
          </div>
        </div>
      </div>
      <ul class="sort-results">
        <li
          v-for="(product, index) in computeddSortedProducts"
          :key="index"
          :title="`${product.title}`"
          @click="HandleClick(product.asin)"
        >
          <div class="product-image">
            <img class="cover" :src="`${product.icon.URL}`" />
          </div>
          <div class="product-details">
            <h3>{{product.title}}</h3>
            <div v-if="sortValue==='Popularity'" name="Popularity">
              <span class="accent">23</span>
              <span class="secondary">products point here</span>
            </div>
            <div v-else-if="sortValue==='Price'">
              <span class="secondary">Price :</span>
              <span class="accent">{{product.price.formatted}}</span>
            </div>
            <div v-else-if="sortValue==='Sales Rank'">
              <span class="secondary">Sales Rank :</span>
              <span class="accent">{{formateNumber(product.salesRank)}}</span>
            </div>
            <div v-else-if="sortValue==='Publication Date'">
              <span class="secondary">Publication Date :</span>
              <span class="accent">{{product.attributes.PublicationDate}}</span>
            </div>
            <div v-else-if="sortValue==='Number of Pages'">
              <span class="secondary">Number of Pages :</span>
              <span class="accent">{{product.attributes.NumberofPages}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { formateNumber } from "./util/util";
export default {
  name: "overview",
  data() {
    return {
      sortOptions: [
        { value: "Price", desc: "Price" },
        { value: "Sales Rank", desc: "Sales Rank" },
        { value: "Publication Date", desc: "Publication Date" },
        { value: " Number of Pages", desc: " Number of Pages" }
      ],
      sortValue: "Price"
    };
  },
  props: {
    products: { type: Array, default: [] }
  },
  methods: {
    hideDetails() {
      this.$emit("closeClick", "overview");
    },
    HandleClick(event) {
      this.$emit("productClicked", event);
    },
    formateNumber
  },
  computed: {
    computedProductCount() {
      return this.products.length;
    },
    computedSortOption() {
      return this.sortOptions.sort((a, b) => (a.value > b.value ? 1 : -1));
    },
    computeddSortedProducts() {
      if (this.products.length === 0) return [];
      if (this.sortValue === "Price") {
        return this.products.sort((a, b) => {
          if (!a.price.hidden) {
            return a.price.amount > b.price.amount ? 1 : -1;
          }
          return 1;
        });
      } else if (this.sortValue === "Sales Rank") {
        return this.products.sort((a, b) => {
          return a.salesRank > b.salesRank ? 1 : -1;
        });
      } else if (this.sortValue === "Publication Date") {
        return this.products.sort((a, b) => {
          return new Date(a.attributes.PublicationDate) >
            new Date(b.attributes.PublicationDate)
            ? 1
            : -1;
        });
      } else if (this.sortValue === "Number of Pages") {
        return this.products.sort((a, b) => {
          return a.attributes.NumberOfPages > b.attributes.NumberOfPages
            ? 1
            : -1;
        });
      }
    }
  }
};
</script>


