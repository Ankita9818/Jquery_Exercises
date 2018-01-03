function Ingredient(url, json, container) {
  this.url = url;
  this.ingredientsJsonData = json;
}

//FUnction which creates the grid
Ingredient.prototype.createIngredientsGrid = function() {
  var _this = this,
    horizontalArray = [];
  this.$ingredientGrid = $('<div>', {
    'class' : 'ingredient-grid col-sm-8 center-block',
    'data-id' : 'ingredient-grid'
  });
  $.each(this.ingredientsJsonData, function() {
    var ingredientGridColumn = _this.createLayout(this);
    horizontalArray.push(ingredientGridColumn);
  });
  _this.$ingredientGrid.append(horizontalArray);
  return this.$ingredientGrid;
};

//FUNCTION TO create layout of grids
Ingredient.prototype.createLayout = function(ingredient) {
  var _this = this;
  this.$ingredientGridColumn = $('<div>', {
    'class' : 'ingredient-div col-sm-3',
    'data-id' : 'ingredient-div',
    'text' : ingredient.ingredient_name.toUpperCase(),
    'data-category' : ingredient.ingredient_name.toLowerCase()
  });
  this.createIngredientColumn(ingredient);
  return this.$ingredientGridColumn;
};

//Function to create each individual column of ingredients
Ingredient.prototype.createIngredientColumn = function(ingredient) {
  for(var index = 0; index < ingredient.ingredient_values.length; index++) {
    var tempIngredient = $('<div>', {
      'class' : 'individual-ingredient-div ingredient-divs',
      'data-id' : 'individual-ingredient-div',
      'data-value' : ingredient.ingredient_values[index].name,
      'data-price' : ingredient.ingredient_values[index].price,
      'text' : ingredient.ingredient_values[index].name + '/' + ingredient.ingredient_values[index].price
    });
    this.$ingredientGridColumn.append(tempIngredient);
  }
};