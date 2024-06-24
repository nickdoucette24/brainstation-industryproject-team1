/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('retailers').del();
  await knex('retailers').insert([
    {
      id: 1,
      name: 'BestBuy',
      totalProducts: 100,
      complianceRate: 85.5,
      averageDeviation: 10.25,
      topOffendingProducts: JSON.stringify([
        { id: 1, product_name: 'Product 1', price: 120.00 },
        { id: 2, product_name: 'Product 2', price: 110.50 }
      ])
    },
    {
      id: 2,
      name: 'Dell',
      totalProducts: 150,
      complianceRate: 92.0,
      averageDeviation: 5.75,
      topOffendingProducts: JSON.stringify([
        { id: 3, product_name: 'Product 3', price: 130.00 },
        { id: 4, product_name: 'Product 4', price: 140.00 }
      ])
    }
  ]);
};
