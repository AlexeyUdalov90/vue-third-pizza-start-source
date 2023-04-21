import doughSizes from '@/common/enums/doughSizes'
import sizes from '@/common/enums/sizes'
import sauces from '@/common/enums/sauces'
import ingredients from '@/common/enums/ingredients'

export const normalizeDough = item => ({
  ...item,
  value: doughSizes[item.id]
})

export const normalizeSize = item => ({
  ...item,
  value: sizes[item.id]
})

export const normalizeSauces = item => ({
  ...item,
  value: sauces[item.id]
})

export const normalizeIngredients = item => ({
  ...item,
  value: ingredients[item.id]
})
