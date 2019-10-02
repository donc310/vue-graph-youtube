<template>
  <div>
    <div class="details-container col list-open">
      <div v-if=" view.scrolledBelowBreakpoint || fixed " class="mini-header row expand-transition">
        <a target="_blank" title="Open on Amazon" :href="product.link">
          <img class="cover" :src="product.icon.URL">
        </a>
        <div class="mini-details">
          <div class="row">
            <h4 :title="product.title">{{product.title}}}</h4>
            <a class="accent tiny-link" :href="product.link">Amazon</a>
          </div>
          <div class="row description">
            <div class="row price-container">
              <div class="price-label">Price:</div>
              <a
                target="_blank"
                title="View on Amazon"
                class="accent price-link"
                :href="product.link"
              >
                <span>{{product.price.formatted}}</span>
              </a>
            </div>
            <div class="buy-btn">
              <a class="shop-btn" target="_blank" title="Open on Amazon" :href="product.link">
                <img
                  src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE1LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHdpZHRoPSIyOHB4IiBoZWlnaHQ9IjI4cHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+CiAgPHJlY3QgeD0iNjQiIHk9IjY0IiB3aWR0aD0iMzg0IiBoZWlnaHQ9IjM4NCIgZmlsbD0iI2ZmZiIvPgoJPHBhdGggZmlsbD0iIzMwMzk0MyIgZD0iTTI5MS43NjUsMjA1LjcxOWMtMTAuOTIyLDAtMjEuODQ0LDAuNzE4LTMxLjMxMiwyLjkwNmMtMTcuNDY4LDUuMDk0LTMxLjMxMywxNi4wMzEtMzEuMzEzLDM5LjMxMwoJCWMwLDE4LjIxOSw5LjQ4NSwzMC41OTQsMjUuNSwzMC41OTRjMi4xODgsMCw0LjM2LTAuNzUxLDUuODEzLTAuNzUxYzkuNDY4LTIuMTg4LDE4LjIwMi04Ljc0OSwyMy4yOTctMTguOTM3CgkJYzguNzItMTQuNTMzLDguMDE2LTI3LjYyNiw4LjAxNi00NC4zNzdMMjkxLjc2NSwyMDUuNzE5TDI5MS43NjUsMjA1LjcxOXoiLz4KCTxwYXRoIGZpbGw9IiMzMDM5NDMiIGQ9Ik00MjYuNjcxLDBIODUuMzQ0QzM4LjQwNiwwLDAsMzguNDA0LDAsODUuMzQ0djM0MS4zMTNDMCw0NzMuNjI1LDM4LjQwNyw1MTIsODUuMzQ0LDUxMmgzNDEuMzI4CgkJQzQ3My42MSw1MTIsNTEyLDQ3My42MjYsNTEyLDQyNi42NTZWODUuMzQ0QzUxMiwzOC40MDQsNDczLjYxLDAsNDI2LjY3MSwweiBNMjg2LjY3MSwxMzUuODEzCgkJYy01LjEwOS03LjI1LTE0LjU3Ny0xMC45MDUtMjMuMjk2LTEwLjkwNWMtMS40NTIsMC0yLjE4OCwwLTIuOTIyLDBjLTE0LjU2MywxLjQ2OS0yNy42NTYsOS40NjgtMzEuMzEzLDI1LjQ2OAoJCWMtMC43MTgsMy42NTYtMi44OTEsNy4yODItNy4yNjYsOC4wMzNsLTQwLjc2NS01LjA5NmMtMi45MDctMC43NDgtNy4yODEtMi45MzgtNS44NDQtOC43NQoJCWM4Ljc0OS00NS44NzUsNDguMDYxLTYxLjg3NSw4NS4xODctNjQuMDYzYzIuOTIyLDAsNS44MjgsMCw4Ljc0OCwwYzIwLjM3NywwLDQ2LjU5Nyw1LjgxMyw2My4zMywyMS4xMjYKCQljMjAuMzc1LDE4LjkwNywxOC4yMDQsNDQuMzc1LDE4LjIwNCw3Mi4wNjN2NjUuNTI5YzAsMTkuNjI2LDgsMjguMzc1LDE2LjAxNiwzOC41NjNjMi4xNzEsMy42NTgsMi45MDYsOC0wLjcyLDEwLjkzOAoJCWMtOC4wMzEsNy4yODItMjMuMzEzLDIwLjM3NS0zMi4wNDcsMjcuNjU2Yy0yLjkwNiwyLjE4OC02LjU0NiwyLjE4OC0xMC4xODgsMC43MThjLTEzLjg0NC0xMS42MjUtMTYuMDE2LTE2LjcxOC0yNC4wMzItMjcuNjU1CgkJYy0xMy44MjYsMTQuNTYzLTI1LjQ2OCwyMi41NjMtMzkuMzEyLDI2LjkzOGMtOC43MiwyLjE4OC0xOC4xODgsMy42MjUtMjkuODQ1LDMuNjI1Yy0zNC45MzcsMC02Mi42MDctMjEuODEzLTYyLjYwNy02NC43ODIKCQljMC0zNC4yMTgsMTguMjA0LTU3LjUsNDUuMTQxLTY4LjQzOGMxMy44MjctNi41MywzMC41NzktOS40NjksNDcuMzEzLTExLjYyNWMxMC45MjItMS40NjcsMjEuODQ0LTIuMTg4LDMxLjMxMi0yLjkzOHYtNS44MTIKCQlDMjkxLjc2NSwxNTYuMjE4LDI5Mi40NjksMTQ0LjU2MywyODYuNjcxLDEzNS44MTN6IE00MTMuOTg1LDM4Ny41OTRjLTUuMTQsMy45MzgtMTAuNjU2LDcuNDk5LTE2LjIwMywxMC42ODgKCQljLTQxLjUzMSwyNC45MDUtOTUuMzEzLDM3Ljk2OC0xNDEuOTg0LDM3Ljk2OGMtNzUuMTU2LDAtMTQyLjM5MS0yNy42ODgtMTkzLjQwNS03My45NjljLTQuMzU4LTMuNTYzLTAuNzk3LTguNjg4LDQuMzQzLTUuOTM4CgkJYzU0Ljk4NCwzMi4wMzEsMTIzLDUxLjQzOCwxOTMuNDA1LDUxLjQzOGM0NC4zMTMsMCw5Mi4xNDEtOC4zMTMsMTM3LjY0MS0yNi4xMjRjMy4xNTctMS4xODgsNi43Mi0yLjc4Miw5Ljg3NC0zLjk3MQoJCUM0MTQuNzgxLDM3NC41Myw0MjEuMTEsMzgyLjQ2OCw0MTMuOTg1LDM4Ny41OTR6IE00NTEuNTYzLDM2Mi4yODFjLTAuMzksMTQuMjUtNy45MDYsNDEuNTI5LTI1LjcwMyw1Ni41NjIKCQljLTMuNTYyLDIuNzgxLTcuMTA5LDEuMTg4LTUuNTQ3LTIuNzhjNS4xNTctMTIuNjU3LDE3LTQxLjkzOCwxMS40ODQtNDguNjU0Yy0zLjk1My01LjEyNi0yMC4xNzItNC43MTktMzQuMDE3LTMuNTY0CgkJYy02LjMyNywwLjgxMy0xMS44NzUsMS4xODgtMTYuMjE5LDJjLTMuOTUyLDAuMzc1LTQuNzUtMy4xNTMtMC43OTgtNS45MzdjNS4xNDEtMy41NjMsMTAuNjg4LTYuMzEzLDE3LjAxNy04LjMxMwoJCWMyMi41My02LjcyMSw0OC42NTUtMi43NTEsNTIuMjIsMS41OTJjMC43NzksMS4xODksMS41NjIsMy41MzEsMS41NjIsNi43MjFMNDUxLjU2MywzNjIuMjgxTDQ1MS41NjMsMzYyLjI4MXoiLz4KPC9nPgo8L3N2Zz4K"
                >
                <div>Amazon</div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div id="topScroll" @scroll="scrollHandler($event)" ref="container" class="central-block col">
        <div v-if="view.reviews" class="customer-reviews">
          <iframe :src="product.reviews"></iframe>
        </div>
        <div v-if="view.description" class="main-product-container">
          <div class="cover-container">
            <a target="_blank" title="Open on Amazon" class="product-cover" :href="product.link">
              <img class="cover" :src="product.image.URL">
            </a>
          </div>
          <div class="buy-btn">
            <a class="shop-btn" target="_blank" title="Open on Amazon" :href="product.link">
              <img
                src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE1LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHdpZHRoPSIyOHB4IiBoZWlnaHQ9IjI4cHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+CiAgPHJlY3QgeD0iNjQiIHk9IjY0IiB3aWR0aD0iMzg0IiBoZWlnaHQ9IjM4NCIgZmlsbD0iI2ZmZiIvPgoJPHBhdGggZmlsbD0iIzMwMzk0MyIgZD0iTTI5MS43NjUsMjA1LjcxOWMtMTAuOTIyLDAtMjEuODQ0LDAuNzE4LTMxLjMxMiwyLjkwNmMtMTcuNDY4LDUuMDk0LTMxLjMxMywxNi4wMzEtMzEuMzEzLDM5LjMxMwoJCWMwLDE4LjIxOSw5LjQ4NSwzMC41OTQsMjUuNSwzMC41OTRjMi4xODgsMCw0LjM2LTAuNzUxLDUuODEzLTAuNzUxYzkuNDY4LTIuMTg4LDE4LjIwMi04Ljc0OSwyMy4yOTctMTguOTM3CgkJYzguNzItMTQuNTMzLDguMDE2LTI3LjYyNiw4LjAxNi00NC4zNzdMMjkxLjc2NSwyMDUuNzE5TDI5MS43NjUsMjA1LjcxOXoiLz4KCTxwYXRoIGZpbGw9IiMzMDM5NDMiIGQ9Ik00MjYuNjcxLDBIODUuMzQ0QzM4LjQwNiwwLDAsMzguNDA0LDAsODUuMzQ0djM0MS4zMTNDMCw0NzMuNjI1LDM4LjQwNyw1MTIsODUuMzQ0LDUxMmgzNDEuMzI4CgkJQzQ3My42MSw1MTIsNTEyLDQ3My42MjYsNTEyLDQyNi42NTZWODUuMzQ0QzUxMiwzOC40MDQsNDczLjYxLDAsNDI2LjY3MSwweiBNMjg2LjY3MSwxMzUuODEzCgkJYy01LjEwOS03LjI1LTE0LjU3Ny0xMC45MDUtMjMuMjk2LTEwLjkwNWMtMS40NTIsMC0yLjE4OCwwLTIuOTIyLDBjLTE0LjU2MywxLjQ2OS0yNy42NTYsOS40NjgtMzEuMzEzLDI1LjQ2OAoJCWMtMC43MTgsMy42NTYtMi44OTEsNy4yODItNy4yNjYsOC4wMzNsLTQwLjc2NS01LjA5NmMtMi45MDctMC43NDgtNy4yODEtMi45MzgtNS44NDQtOC43NQoJCWM4Ljc0OS00NS44NzUsNDguMDYxLTYxLjg3NSw4NS4xODctNjQuMDYzYzIuOTIyLDAsNS44MjgsMCw4Ljc0OCwwYzIwLjM3NywwLDQ2LjU5Nyw1LjgxMyw2My4zMywyMS4xMjYKCQljMjAuMzc1LDE4LjkwNywxOC4yMDQsNDQuMzc1LDE4LjIwNCw3Mi4wNjN2NjUuNTI5YzAsMTkuNjI2LDgsMjguMzc1LDE2LjAxNiwzOC41NjNjMi4xNzEsMy42NTgsMi45MDYsOC0wLjcyLDEwLjkzOAoJCWMtOC4wMzEsNy4yODItMjMuMzEzLDIwLjM3NS0zMi4wNDcsMjcuNjU2Yy0yLjkwNiwyLjE4OC02LjU0NiwyLjE4OC0xMC4xODgsMC43MThjLTEzLjg0NC0xMS42MjUtMTYuMDE2LTE2LjcxOC0yNC4wMzItMjcuNjU1CgkJYy0xMy44MjYsMTQuNTYzLTI1LjQ2OCwyMi41NjMtMzkuMzEyLDI2LjkzOGMtOC43MiwyLjE4OC0xOC4xODgsMy42MjUtMjkuODQ1LDMuNjI1Yy0zNC45MzcsMC02Mi42MDctMjEuODEzLTYyLjYwNy02NC43ODIKCQljMC0zNC4yMTgsMTguMjA0LTU3LjUsNDUuMTQxLTY4LjQzOGMxMy44MjctNi41MywzMC41NzktOS40NjksNDcuMzEzLTExLjYyNWMxMC45MjItMS40NjcsMjEuODQ0LTIuMTg4LDMxLjMxMi0yLjkzOHYtNS44MTIKCQlDMjkxLjc2NSwxNTYuMjE4LDI5Mi40NjksMTQ0LjU2MywyODYuNjcxLDEzNS44MTN6IE00MTMuOTg1LDM4Ny41OTRjLTUuMTQsMy45MzgtMTAuNjU2LDcuNDk5LTE2LjIwMywxMC42ODgKCQljLTQxLjUzMSwyNC45MDUtOTUuMzEzLDM3Ljk2OC0xNDEuOTg0LDM3Ljk2OGMtNzUuMTU2LDAtMTQyLjM5MS0yNy42ODgtMTkzLjQwNS03My45NjljLTQuMzU4LTMuNTYzLTAuNzk3LTguNjg4LDQuMzQzLTUuOTM4CgkJYzU0Ljk4NCwzMi4wMzEsMTIzLDUxLjQzOCwxOTMuNDA1LDUxLjQzOGM0NC4zMTMsMCw5Mi4xNDEtOC4zMTMsMTM3LjY0MS0yNi4xMjRjMy4xNTctMS4xODgsNi43Mi0yLjc4Miw5Ljg3NC0zLjk3MQoJCUM0MTQuNzgxLDM3NC41Myw0MjEuMTEsMzgyLjQ2OCw0MTMuOTg1LDM4Ny41OTR6IE00NTEuNTYzLDM2Mi4yODFjLTAuMzksMTQuMjUtNy45MDYsNDEuNTI5LTI1LjcwMyw1Ni41NjIKCQljLTMuNTYyLDIuNzgxLTcuMTA5LDEuMTg4LTUuNTQ3LTIuNzhjNS4xNTctMTIuNjU3LDE3LTQxLjkzOCwxMS40ODQtNDguNjU0Yy0zLjk1My01LjEyNi0yMC4xNzItNC43MTktMzQuMDE3LTMuNTY0CgkJYy02LjMyNywwLjgxMy0xMS44NzUsMS4xODgtMTYuMjE5LDJjLTMuOTUyLDAuMzc1LTQuNzUtMy4xNTMtMC43OTgtNS45MzdjNS4xNDEtMy41NjMsMTAuNjg4LTYuMzEzLDE3LjAxNy04LjMxMwoJCWMyMi41My02LjcyMSw0OC42NTUtMi43NTEsNTIuMjIsMS41OTJjMC43NzksMS4xODksMS41NjIsMy41MzEsMS41NjIsNi43MjFMNDUxLjU2MywzNjIuMjgxTDQ1MS41NjMsMzYyLjI4MXoiLz4KPC9nPgo8L3N2Zz4K"
              >
              <div>Amazon</div>
            </a>
          </div>
          <div class="attributes-container">
            <div>
              <div class="row wrap">
                <h3 class="product-title">
                  {{product.title}}
                  <small
                    class="secondary nowrap"
                  >{{product.attributes.PublicationDate}}</small>
                </h3>
              </div>
              <div  v-if="false" class="authors row wrap">
                <div class="space-letter">
                  <span>by</span>
                  <span>Barbara W. Makar</span>
                </div>
              </div>
              <div class="row price-container">
                <div class="price-label">Price:</div>
                <a
                  target="_blank"
                  title="View on Amazon"
                  class="accent price-link"
                  :href="product.link"
                >
                  <span>{{product.price.formatted}}</span>
                </a>
              </div>
              <div class="row wrap">
                <div class="attr-name space-letter">Sales Rank:</div>
                <div class="value">{{formateNumber(product.salesRank)}}</div>
              </div>
              <div v-if="false" class="row wrap">
                <div class="attr-name space-letter">Publisher:</div>
                <div class="value">Educators Pub Svc Inc</div>
              </div>
            </div>
            <div v-if="false" class="item-nodes">
              <a
                target="_blank"
                title="Open on Amazon"
                href="http://www.amazon.com/b/?node=5267708011&amp;tag=wwwyasivcom-20"
              >Schools &amp; Teaching</a>
              <a
                target="_blank"
                title="Open on Amazon"
                href="http://www.amazon.com/b/?node=11711&amp;tag=wwwyasivcom-20"
              >Workbooks</a>
              <a
                target="_blank"
                title="Open on Amazon"
                href="http://www.amazon.com/b/?node=12900351&amp;tag=wwwyasivcom-20"
              >Early Childhood Education Materials</a>
            </div>
            <div>
              <h5>Product Description</h5>
              <span v-html="formatDescription( product.descriptions)"></span>
            </div>
          </div>

          <div v-if="false">
            <hr>
            <div class="bought-with">
              <h4 class="section-title">Customers often buy this product with...</h4>

              <ul>
                <li
                  title="Graph Paper Notebook: 1 Inches Square Blank Quad Ruled - (Large Print 8.5&quot;x11&quot;) - 108 Pages Graph Paper Composition Notebook: Graph Paper Notebook (Volume 3)"
                  data-asin="1717036805"
                >
                  <div class="product-image">
                    <img
                      class="cover"
                      src="https://images-na.ssl-images-amazon.com/images/I/410HPAE4PKL._SL160_.jpg"
                    >
                  </div>
                  <div
                    class="product-details"
                  >Graph Paper Notebook: 1 Inches Square Blank Quad Ruled - (Large Print 8.5"x11") - 108 Pages Graph Paper Composition Notebook: Graph Paper Notebook (Volume 3)</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="actions">
        <a href="#" @click="handleClose" class="btn primary">Close</a>
        <a href="#" @click="toggleView" class="btn accent">{{computedDisplay}}</a>
      </div>
    </div>
  </div>
</template>
<script>
import { formateNumber , formatDescription} from "./util/util";

export default {
  name: "graphDetail",
  props: { product: { type: Object, default: {} } },
  data() {
    return {
      view: {
        description: true,
        reviews: false,
        scrolledBelowBreakpoint: false,
        fixed: false
      }
    };
  },
  methods: {
    handleClose() {
      this.$emit("closeDetail", true);
    },
    toggleView() {
      if (this.view.description) {
        this.view.description = false;
        this.view.reviews = true;
        return;
      }
      if (this.view.reviews) {
        this.view.description = true;
        this.view.reviews = false;
        return;
      }
    },
    scrollHandler(t) {
      var n = t.srcElement;
      if (n.classList.contains("central-block")) {
        var i = n.clientHeight < 600 ? 300 : 500;
        this.view.scrolledBelowBreakpoint = n.scrollTop > i;
      }
    },
    formateNumber,
    formatDescription
  },
  watch: {
    "view.reviews": {
      handler: function(newvalue) {
        if (newvalue) {
          this.fixed = true;
          var vm = this;
          setTimeout(() => {
            return vm.$refs.container.scrollIntoView();
          }, 0);
        } else {
          this.fixed = false;
        }
      },
      deep: false
    }
  },
  computed: {
    computedDisplay() {
      return this.view.description
        ? " Customer Reviews"
        : "Product Description";
    }
  },
  mounted: function() {},
  beforeDestroy: function() {}
};
</script>


