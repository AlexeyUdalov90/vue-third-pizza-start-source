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
  padding-top: 20px;

  &__wrapper {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;

    width: 920px;
    margin: 0 auto;
    padding-right: 2.12%;
    padding-bottom: 30px;
    padding-left: 2.12%;
  }

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

.sheet {
  padding-top: 15px;

  border-radius: 8px;
  background-color: $white;
  box-shadow: $shadow-light;

  &__title {
    padding-right: 18px;
    padding-left: 18px;
  }

  &__content {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    margin-top: 8px;
    padding-top: 18px;
    padding-right: 18px;
    padding-left: 18px;

    border-top: 1px solid rgba($green-500, 0.1);
  }
}

.filling {
  @include r-s14-h16;

  position: relative;

  display: block;

  padding-left: 36px;

  &::before {
    @include p_center-v;

    display: block;

    width: 32px;
    height: 32px;

    content: "";

    border-radius: 50%;
    background-color: $white;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 80% 80%;

  }

  &--tomatoes::before {
    background-image: url("@/assets/img/filling/tomatoes.svg");
  }

  &--ananas::before {
    background-image: url("@/assets/img/filling/ananas.svg");
  }

  &--bacon::before {
    background-image: url("@/assets/img/filling/bacon.svg");
  }

  &--blue_cheese::before {
    background-image: url("@/assets/img/filling/blue_cheese.svg");
  }

  &--cheddar::before {
    background-image: url("@/assets/img/filling/cheddar.svg");
  }

  &--chile::before {
    background-image: url("@/assets/img/filling/chile.svg");
  }

  &--ham::before {
    background-image: url("@/assets/img/filling/ham.svg");
  }

  &--jalapeno::before {
    background-image: url("@/assets/img/filling/jalapeno.svg");
  }

  &--mozzarella::before {
    background-image: url("@/assets/img/filling/mozzarella.svg");
  }

  &--mushrooms::before {
    background-image: url("@/assets/img/filling/mushrooms.svg");
  }

  &--olives::before {
    background-image: url("@/assets/img/filling/olives.svg");
  }

  &--onion::before {
    background-image: url("@/assets/img/filling/onion.svg");
  }

  &--parmesan::before {
    background-image: url("@/assets/img/filling/parmesan.svg");
  }

  &--salami::before {
    background-image: url("@/assets/img/filling/salami.svg");
  }

  &--salmon::before {
    background-image: url("@/assets/img/filling/salmon.svg");
  }
}

.title {
  box-sizing: border-box;
  width: 100%;
  margin: 0;

  color: $black;

  &--big {
    @include b-s36-h42;
  }

  &--small {
    @include b-s18-h21;
  }
}

.input {
  display: block;

  span {
    @include r-s14-h16;

    display: block;

    margin-bottom: 4px;
  }

  input {
    @include r-s16-h19;

    display: block;

    box-sizing: border-box;
    width: 100%;
    margin: 0;
    padding: 8px 16px;

    transition: 0.3s;

    color: $black;
    border: 1px solid $purple-400;
    border-radius: 8px;
    outline: none;
    background-color: $white;

    font-family: inherit;

    &:focus {
      border-color: $green-500;
    }
  }

  &:hover {
    input {
      border-color: $black;
    }
  }

  &--big-label {
    display: flex;
    align-items: center;

    span {
      @include b-s16-h19;

      margin-right: 16px;

      white-space: nowrap;
    }
  }
}

.pizza {
  position: relative;

  display: block;

  box-sizing: border-box;
  width: 100%;

  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;

  &--foundation--big-creamy {
    background-image: url("@/assets/img/foundation/big-creamy.svg");
  }

  &--foundation--big-tomato {
    background-image: url("@/assets/img/foundation/big-tomato.svg");
  }

  &--foundation--small-creamy {
    background-image: url("@/assets/img/foundation/small-creamy.svg");
  }

  &--foundation--small-tomato {
    background-image: url("@/assets/img/foundation/small-tomato.svg");
  }

  &__wrapper {
    width: 100%;
    padding-bottom: 100%;
  }

  &__filling {
    $bl: &;
    position: absolute;
    top: 0;
    left: 0;

    display: block;

    width: 100%;
    height: 100%;

    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;

    &::before,
    &::after {
      display: none;

      position: absolute;
      top: 0;
      left: 0;

      width: 100%;
      height: 100%;

      content: '';

      background-image: inherit;
    }

    &--second {
      &::before {
        display: block;

        transform: rotate(45deg);
      }
    }

    &--third {
      &::before {
        display: block;

        transform: rotate(45deg);
      }

      &::after {
        display: block;

        transform: rotate(-45deg);
      }
    }

    &--ananas,
    &--ananas.pizza__filling--second::before,
    &--ananas.pizza__filling--third::after {
      background-image: url("@/assets/img/filling-big/ananas.svg");
    }

    &--bacon,
    &--bacon.pizza__filling--second::before,
    &--bacon.pizza__filling--third::after {
      background-image: url("@/assets/img/filling-big/bacon.svg");
    }

    &--blue_cheese,
    &--blue.pizza__filling--second::before,
    &--blue.pizza__filling--third::after {
      background-image: url("@/assets/img/filling-big/blue_cheese.svg");
    }

    &--cheddar,
    &--cheddar.pizza__filling--second::before,
    &--cheddar.pizza__filling--third::after {
      background-image: url("@/assets/img/filling-big/cheddar.svg");
    }

    &--chile,
    &--chile.pizza__filling--second::before,
    &--chile.pizza__filling--third::after {
      background-image: url("@/assets/img/filling-big/chile.svg");
    }

    &--ham,
    &--ham.pizza__filling--second::before,
    &--ham.pizza__filling--third::after {
      background-image: url("@/assets/img/filling-big/ham.svg");
    }

    &--jalapeno,
    &--jalapeno.pizza__filling--second::before,
    &--jalapeno.pizza__filling--third::after {
      background-image: url("@/assets/img/filling-big/jalapeno.svg");
    }

    &--mozzarella,
    &--mozzarella.pizza__filling--second::before,
    &--mozzarella.pizza__filling--third::after {
      background-image: url("@/assets/img/filling-big/mozzarella.svg");
    }

    &--mushrooms,
    &--mushrooms.pizza__filling--second::before,
    &--mushrooms.pizza__filling--third::after {
      background-image: url("@/assets/img/filling-big/mushrooms.svg");
    }

    &--olives,
    &--olives.pizza__filling--second::before,
    &--olives.pizza__filling--third::after {
      background-image: url("@/assets/img/filling-big/olives.svg");
    }

    &--onion,
    &--onion.pizza__filling--second::before,
    &--onion.pizza__filling--third::after {
      background-image: url("@/assets/img/filling-big/onion.svg");
    }

    &--parmesan,
    &--parmesan.pizza__filling--second::before,
    &--parmesan.pizza__filling--third::after {
      background-image: url("@/assets/img/filling-big/parmesan.svg");
    }

    &--salami,
    &---salami.pizza__filling--second::before,
    &---salami.pizza__filling--third::after {
      background-image: url("@/assets/img/filling-big/salami.svg");
    }

    &--salmon,
    &--salmon.pizza__filling--second::before,
    &--salmon.pizza__filling--third::after {
      background-image: url("@/assets/img/filling-big/salmon.svg");
    }

    &--tomatoes,
    &--tomatoes.pizza__filling--second::before,
    &--tomatoes.pizza__filling--third::after {
      background-image: url("@/assets/img/filling-big/tomatoes.svg");
    }
  }
}

.button {
  $bl: &;

  @include b-s18-h21;
  font-family: inherit;
  display: block;

  box-sizing: border-box;
  margin: 0;
  padding: 0;

  cursor: pointer;
  transition: 0.3s;
  text-align: center;

  color: $white;
  border: none;
  border-radius: 8px;
  outline: none;
  box-shadow: $shadow-medium;

  background-color: $green-500;

  &:hover:not(:active):not(:disabled) {
    background-color: $green-400;
  }

  &:active:not(:disabled) {
    background-color: $green-600;
  }

  &:focus:not(:disabled) {
    opacity: 0.5;
  }

  &:disabled {
    background-color: $green-300;
    color: rgba($white, 0.2);
    cursor: default;
  }

  &--border {
    background-color: transparent;
    border: 1px solid $green-500;
    color: $black;
    box-shadow: none;

    &:hover:not(:active):not(:disabled) {
      color: $green-500;
      border-color: $green-500;
      background-color: transparent;
    }

    &:active:not(:disabled) {
      color: $green-600;
      border-color: $green-600;
      background-color: transparent;
    }

    &:disabled {
      opacity: 0.5;
    }
  }

  &--transparent {
    @include b-s14-h16;
    background-color: transparent;
    box-shadow: none;
    color: $black;

    &:hover:not(:active):not(:disabled) {
      color: $red-800;
      background-color: transparent;
    }

    &:active:not(:disabled) {
      color: $red-900;
      background-color: transparent;
    }

    &:disabled {
      opacity: 0.25;
    }
  }

  &--arrow {
    &::before {
      content: "";
      background-image: url("@/assets/img/button-arrow.svg");
      background-position: center;
      background-repeat: no-repeat;
      margin-right: 16px;
      width: 18px;
      height: 18px;
      display: inline-block;
      vertical-align: middle;
      transform: translateY(-1px);
    }
  }

  &--white {
    background-color: $white;
    color: $green-500;
  }
}

.radio {
  cursor: pointer;

  span {
    @include r-s16-h19;

    position: relative;

    padding-left: 28px;

    &:before {
      @include p_center-v;

      display: block;

      box-sizing: border-box;
      width: 20px;
      height: 20px;

      content: "";
      transition: 0.3s;

      border: 1px solid $purple-400;
      border-radius: 50%;
      background-color: $white;
    }
  }

  &:hover {
    input:not(:checked):not(:disabled) + span {
      &:before {
        border-color: $purple-800;
      }
    }
  }

  input {
    display: none;

    &:checked + span {
      &:before {
        border: 6px solid $green-500;
      }
    }

    &:disabled {
      & + span {
        &:before {
          border-color: $purple-400;
          background-color: $silver-200;
        }
      }

      &:checked + span {
        &:before {
          border: 6px solid $purple-400;
        }
      }
    }
  }
}
</style>
