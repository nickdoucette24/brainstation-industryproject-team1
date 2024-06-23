#!/usr/bin/env python
# coding: utf-8

# In[1]:


# This script is used to scrape the monitor product info from Canada Computers & Electronics
# Always run the scraper first before doing any data analysis

# Import necessary libraries

from bs4 import BeautifulSoup
import requests
import pandas as pd
from string import digits
import datetime


# In[2]:


# Get the current date for dataset reference

current_time = datetime.datetime.now()
date = str(current_time.year) + str(current_time.month) + str(current_time.day)


# In[3]:


# Initiate and fetch the first page from newegg

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
url = f'https://www.newegg.ca/p/pl?d=monitor+dell&page=1'
response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.content, 'html.parser')


# In[4]:


# Fetch the number of total product pages in newegg website

pageinfo = soup.find('div', class_ = 'list-tool-pagination').get_text().split('/')[1]
pageinfo = ''.join(c for c in pageinfo if c in digits)
page_loop = int(pageinfo) + 1

print('Loop through this many pages: ', page_loop - 1)


# In[5]:


def scrape_newegg_monitor():
    
    # Create all the dummy variables
    product_name = []
    product_id = []
    specs = []
    price = []
    link = []
    
    headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    # Run this part to get the html info from the url we wanted
    # and loop it through the pages that we defined earlier
    
    for i in range(1, page_loop):
        url = f'https://www.newegg.ca/p/pl?d=monitor+dell&page={i}'
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # These variables are temporary holders for the data that we want
        product_name_holder = soup.find_all('div', class_ = 'item-info')
        product_id_holder = soup.find_all('div', class_ = 'item-info')
        price_holder = soup.find_all('li', class_ = 'price-current')
        link_holder = soup.find_all('div', class_ = 'item-info')
        
        # The following FOR loops are to clean the temporary holders that we fetched above
        
        for a in product_name_holder:
            a = a.get_text().strip('\n')
            product_name.append(a)
            
        for b in product_id_holder:
            b = str(b)
            b = b.split('//')[-1].split('"')[0]
            b = b.split('/')[-1]
            product_id.append(b)
        
        for d in price_holder:
            d = d.get_text().split(u'\xa0')[0].strip('\n')
            d = d.strip('$')
            d = d.replace(',', '')
            d = d.replace(' ','')
            price.append(d)

        for h in link_holder:
            h = str(h)
            h = h.split('//')[-1].split('"')[0]
            link.append(h)
        
        print(f'fetching page {i}')
        i+=1

    # Print out the length of each "column" for easy de-bugging
    print(len(product_name))
    print(len(product_id))
    print(len(price))
    print(len(link))
    
    # Put the data in a dataframe
    print('Below is the 10 rows of the fetched data:')
    dict = {'Newegg_name': product_name, 'Newegg_sku': product_id, 'Newegg_price' : price, 'Newegg_link': link }
    
    newegg_monitor = pd.DataFrame(dict)
    
    display(newegg_monitor.head(10))
    
    # Write data to csv
    newegg_monitor.to_csv(f'newegg_dell_monitor{date}.csv')
    print(f'Data scraped and saved to newegg_dell_monitor{date}.csv')

# Run this function
if __name__ == '__main__':
    scrape_newegg_monitor()

