// Declara a variável 'camiseta' com o preço original de 80 reais
let camiseta: number = 80;

// Declara a variável 'desconto' com o valor de 15% (0.15)
let desconto: number = 0.15;

// Calcula o valor do desconto
let valorDesconto: number = camiseta * desconto;

// Calcula o preço final após o desconto
let precoFinal: number = camiseta - valorDesconto;

// Exibe o preço final no console
console.log("Preço original: R$", camiseta);
console.log("Desconto: R$", valorDesconto);
console.log("Preço final com desconto: R$", precoFinal);
