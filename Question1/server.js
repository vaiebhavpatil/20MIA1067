const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Test server 
const TEST_SERVER_URL = 'http://20.244.56.144/test/';

async function fetchProducts(company, category, n, minPrice, maxPrice, headers) {
  try {
    const response = await axios.get(`${TEST_SERVER_URL}companies/${company}/categories/${category}/products`, {
      params: {
        top: n,
        minPrice,
        maxPrice,
      },
      headers: headers // Pass the headers here
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

app.get('/categories/:categoryname/products', async (req, res) => {
  const { categoryname } = req.params;
  const { companyname, top, minPrice, maxPrice } = req.query;

 if (!isValidCategory(categoryname)) {
    return res.status(400).json({ error: 'Invalid category name' });
  }
  if (companyname && !isValidCompany(companyname)) {
    return res.status(400).json({ error: 'Invalid company name' });
  }

 
  const n = parseInt(top) || 10;
  const min = parseInt(minPrice) || 1;
  const max = parseInt(maxPrice) || 10000;

  // Authorization headers
  const headers = {
    'Authorization': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzExNzkzNTA0LCJpYXQiOjE3MTE3OTMyMDQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjMxMTIyZDgwLWQyNDEtNGEzOS05NjNkLWE5NzkxZGQ3ODViMiIsInN1YiI6InZhaWViaGF2cGF0aWxvZjIwMDJAZ21haWwuY29tIn0sImNvbXBhbnlOYW1lIjoic2VydmljZUh1YiIsImNsaWVudElEIjoiMzExMjJkODAtZDI0MS00YTM5LTk2M2QtYTk3OTFkZDc4NWIyIiwiY2xpZW50U2VjcmV0IjoiS0hrTUpBeUJNUUJac05UdSIsIm93bmVyTmFtZSI6IlZhaWViaGF2IFBhdGlsIiwib3duZXJFbWFpbCI6InZhaWViaGF2cGF0aWxvZjIwMDJAZ21haWwuY29tIiwicm9sbE5vIjoiMjBNSUExMDY3In0.F4OPA6mB8HpohThuXO_51qmpmdw0q2zkdvLuNNMkNLw",
    'Content-Type': 'application/json'
  };

  try {
   
    const products = await fetchProducts(companyname, categoryname, n, min, max, headers);
    
    const productsWithIds = products.map(product => ({ ...product, id: uuidv4() }));

    res.json(productsWithIds);
  } catch (error) {
    console.error('Error retrieving top products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

