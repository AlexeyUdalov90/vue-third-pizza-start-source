<template>
  <main class="content">
    <form action="#" method="post">

      <div class="content__wrapper">
        <h1 class="title title--big">Конструктор пиццы</h1>

        <div class="content__dough">

          <div class="sheet">
            <h2 class="title title--small sheet__title">Выберите тесто</h2>

            <div class="sheet__content dough">
              <label
                  v-for="dough in normalizedDough"
                  :key="dough.id"
                  :class="`dough__input dough__input--${dough.type}`"
              >
                <input
                    type="radio"
                    name="dought"
                    :value="dough.type"
                    class="visually-hidden"
                >
                <img :src="getImage(dough.image)" :alt="dough.name" />
                <b>{{ dough.name }}</b>
                <span>{{ dough.description }}</span>
              </label>
            </div>

          </div>

        </div>

        <div class="content__diameter">
          <div class="sheet">
            <h2 class="title title--small sheet__title">Выберите размер</h2>

            <div class="sheet__content diameter">
              <label
                v-for="size in normalizedSizes"
                :key="size.id"
                :class="`diameter__input diameter__input--${size.type}`"
              >
                <input type="radio" name="diameter" :value="size.type" class="visually-hidden">
                <span>{{ size.name }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="content__ingredients">
          <div class="sheet">
            <h2 class="title title--small sheet__title">Выберите ингредиенты</h2>

            <div class="sheet__content ingredients">

              <div class="ingredients__sauce">
                <p>Основной соус:</p>

                <label v-for="sauce in normalizedSauces" :key="`sauce${sauce.id}`" class="radio ingredients__input">
                  <input type="radio" name="sauce" :value="sauce.type">
                  <span>{{ sauce.name }}</span>
                </label>
              </div>

              <div class="ingredients__filling">
                <p>Начинка:</p>

                <ul class="ingredients__list">
                  <li v-for="ingredient in normalizedIngredients" :key="`ingredient${ingredient.id}`" class="ingredients__item">
                    <div class="filling">
                      <img
                          :src="getImage(ingredient.image)"
                          :alt="ingredient.name"
                      />
                      {{ ingredient.name }}
                    </div>

                    <div class="counter counter--orange ingredients__counter">
                      <button type="button" class="counter__button counter__button--minus" disabled>
                        <span class="visually-hidden">Меньше</span>
                      </button>
                      <input type="text" name="counter" class="counter__input" value="0">
                      <button type="button" class="counter__button counter__button--plus">
                        <span class="visually-hidden">Больше</span>
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="content__pizza">
          <label class="input">
            <span class="visually-hidden">Название пиццы</span>
            <input type="text" name="pizza_name" placeholder="Введите название пиццы">
          </label>

          <div class="content__constructor">
            <div class="pizza pizza--foundation--big-tomato">
              <div class="pizza__wrapper">
                <div class="pizza__filling pizza__filling--ananas"></div>
                <div class="pizza__filling pizza__filling--bacon"></div>
                <div class="pizza__filling pizza__filling--cheddar"></div>
              </div>
            </div>
          </div>

          <div class="content__result">
            <p>Итого: 0 ₽</p>
            <button type="button" class="button" disabled>Готовьте!</button>
          </div>
        </div>
      </div>
    </form>
  </main>
</template>

<script setup>
import dough from '@/mocks/dough.json'
import sizes from '@/mocks/sizes.json'
import sauces from '@/mocks/sauces.json'
import ingredients from '@/mocks/ingredients.json'
import { normalizeDough, normalizeSize, normalizeSauces, normalizeIngredients } from '@/common/helpers'

const normalizedDough = dough.map(normalizeDough)
const normalizedSizes = sizes.map(normalizeSize)
const normalizedSauces = sauces.map(normalizeSauces)
const normalizedIngredients = ingredients.map(normalizeIngredients)

const getImage = image => {
  // https://vitejs.dev/guide/assets.html#new-url-url-import-meta-url
  return new URL(`../assets/img/${image}`, import.meta.url).href
}
</script>

<style scoped>

</style>
