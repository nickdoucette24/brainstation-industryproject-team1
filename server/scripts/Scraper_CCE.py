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


# Scraper

def scrape_CCE_monitor():
    
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
    
    url = f'https://www.canadacomputers.com/search/results_details.php?keywords=dell%20monitor'
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')
        
    # These variables are temporary holders for the data that we want
    product_name_holder = soup.find_all('a', class_ = 'text-dark text-truncate_3')
    product_id_holder = soup.find_all('span', class_ = 'd-none d-sm-inline font-weight-bold')
    price_holder = soup.find_all('span', class_ = 'd-block mb-0 pq-hdr-product_price line-height')
    link_holder = soup.find_all('a', class_ = 'text-dark text-truncate_3')
        
    # The following FOR loops are to clean the temporary holders that we fetched above
        
    for a in product_name_holder:
        a = a.get_text().strip('\n')
        product_name.append(a)
            
    for b in product_id_holder:
        b = str(b.get_text().strip('\t'))
        b = b.split(':')[1]
        product_id.append(b)
        
    for d in price_holder:
        d = d.get_text()
        d = d.strip('$')
        d = d.replace(',', '')
        d = float(d)
        price.append(d)

    for h in link_holder:
        h = str(h)
        h = h.split('//')[-1].split('"')[0]
        link.append(h)
        
    # Print out the length of each "column" for easy de-bugging 
    # You can delete the following 4 lines if that's not necessary
    print(len(product_name))
    print(len(product_id))
    print(len(price))
    print(len(link))
    
    # Put the data in a dataframe
    print('Below is the 10 rows of the fetched data:')
    dict = {'CCE_name': product_name, 'CCE_sku': product_id, 'CCE_price' : price, 'CCE_link': link }
    
    CCE_monitor = pd.DataFrame(dict)
    
    display(CCE_monitor.head(10))
    
    # Write data to csv
    CCE_monitor.to_csv(f'CCE_dell_monitor{date}.csv')
    print(f'Data scraped and saved to CCE_dell_monitor{date}.csv')

# Run this function
if __name__ == '__main__':
    scrape_CCE_monitor()

