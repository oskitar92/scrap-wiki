const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express()
const port = 3000

app.get('/', async (req, res) => {
  const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap';
  
  try {
    
    const response = await axios.get(url)
    const data = response.data;
    
    
    const $ = cheerio.load(data)
    
    
    const results = []
    
    
    $('#mw-pages a').each((index, element) => {
      
      const link = $(element).attr('href');
      const fullLink = `https://es.wikipedia.org${link}`;
      
      
      const pageResponse = axios.get(fullLink);
      const pageData = pageResponse.data;
      const page$ = cheerio.load(pageData);
      
      
      const title = page$('h1').text();
      const images = [];
      page$('img').each((index, img) => {
        images.push(page$(img).attr('src'));
      });
      const texts = [];
      page$('p').each((index, p) => {
        texts.push(page$(p).text());
      });
      
      
      results.push({
        title,
        images,
        texts
      });
    });

    
    res.json(results);
  } catch (error) {
    console.error('Error durante el scraping:', error);
    
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
