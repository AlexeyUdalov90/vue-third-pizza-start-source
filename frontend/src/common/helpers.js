import doughSizes from '@/common/enums/doughSizes'
import sizes from '@/common/enums/sizes'
import sauces from '@/common/enums/sauces'
import ingredients from '@/common/enums/ingredients'

export const normalizeDough = item => ({
  ...item,
  type: doughSizes[item.id]
})

export const normalizeSize = item => ({
  ...item,
  type: sizes[item.id]
})

export const normalizeSauces = item => ({
  ...item,
  type: sauces[item.id]
})

export const normalizeIngredients = item => ({
  ...item,
  type: ingredients[item.id]
})
