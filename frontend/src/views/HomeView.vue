<template>
  <main class="content">
    <form action="#" method="post">

      <div class="content__wrapper">
        <h1 class="title title--big">Конструктор пиццы</h1>

        <dough-selector
          v-model="pizza.dough"
          :items="doughItems"
        />

        <diameter-selector
          v-model="pizza.size"
          :items="sizeItems"
        />

        <div class="content__ingredients">
          <div class="sheet">
            <h2 class="title title--small sheet__title">Выберите ингредиенты</h2>

            <div class="sheet__content ingredients">

              <sauce-selector
                v-model="pizza.sauce"
                :items="sauceItems"
              />

              <ingredients-selector
                :values="pizza.ingredients"
                :items="ingredientItems"
                @update="updateIngredientAmount"
              />
            </div>
          </div>
        </div>

        <div class="content__pizza">
          <label class="input">
            <span class="visually-hidden">Название пиццы</span>
            <input type="text" name="pizza_name" placeholder="Введите название пиццы">
          </label>

          <pizza-constructor
            :dough="pizza.dough"
            :sauce="pizza.sauce"
            :ingredients="pizza.ingredients"
            @drop="addIngredient"
          />

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
import { reactive, computed } from 'vue'
import dough from '@/mocks/dough.json'
import sizes from '@/mocks/sizes.json'
import sauces from '@/mocks/sauces.json'
import ingredients from '@/mocks/ingredients.json'
import { normalizeDough, normalizeSize, normalizeSauces, normalizeIngredients } from '@/common/helpers'

import DoughSelector from "@/modules/constructor/DoughSelector.vue";
import DiameterSelector from "@/modules/constructor/DiameterSelector.vue";
import SauceSelector from "@/modules/constructor/SauceSelector.vue";
import IngredientsSelector from "@/modules/constructor/IngredientsSelector.vue";
import PizzaConstructor from "@/modules/constructor/PizzaConstructor.vue";

const doughItems = dough.map(normalizeDough)
const sizeItems = sizes.map(normalizeSize)
const sauceItems = sauces.map(normalizeSauces)
const ingredientItems = ingredients.map(normalizeIngredients)

const pizza = reactive({
  name: "",
  dough: doughItems[0].value,
  size: sizeItems[0].value,
  sauce: sauceItems[0].value,
  ingredients: ingredientItems.reduce((acc, item) => {
    acc[item.value] = 0;
    return acc;
  }, {}),
});

const price = computed(() => {
  const { dough, size, sauce, ingredients } = pizza;

  const sizeMultiplier =
      sizeItems.find((item) => item.value === size)?.multiplier ?? 1;

  const doughPrice =
      doughItems.find((item) => item.value === dough)?.price ?? 0;

  const saucePrice =
      sauceItems.find((item) => item.value === sauce)?.price ?? 0;

  /*
  * Здесь мы при помощи метода map превращаем массив ингредиентов
  * в массив значений, соответствующих итоговой стоимости каждого из них — просто умножаем цену на количество.
  * После чего методом reduce вычисляем сумму всех элементов массива. Это даёт нам общую стоимость ингредиентов.
  */
  const ingredientsPrice = ingredientItems
      .map((item) => ingredients[item.value] * item.price)
      .reduce((acc, item) => acc + item, 0);

  return (doughPrice + saucePrice + ingredientsPrice) * sizeMultiplier;
});

const disableSubmit = computed(() => {
  return pizza.name.length === 0 || price.value === 0;
});
const addIngredient = (ingredient) => {
  pizza.ingredients[ingredient]++;
};
const updateIngredientAmount = (ingredient, count) => {
  pizza.ingredients[ingredient] = count;
};

const getImage = image => {
  // https://vitejs.dev/guide/assets.html#new-url-url-import-meta-url
  return new URL(`../assets/img/${image}`, import.meta.url).href
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/ds-system/ds.scss";
@import "@/assets/scss/mixins/mixins.scss";

.content {
  &__ingredients {
    width: 527px;
    margin-top: 15px;
    margin-right: auto;
    margin-bottom: 15px;
  }

  &__pizza {
    width: 373px;
    margin-top: 15px;
    margin-bottom: 15px;
  }

  &__constructor {
    width: 315px;
    margin-top: 25px;
    margin-right: auto;
    margin-left: auto;
  }

  &__result {
    display: flex;
    align-items: center;
    justify-content: center;

    margin-top: 25px;

    p {
      @include b-s24-h28;

      margin: 0;
    }

    button {
      margin-left: 12px;
      padding: 16px 45px;
    }
  }
}
</style>
