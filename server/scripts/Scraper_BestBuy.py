#!/usr/bin/env python
# coding: utf-8

# In[1]:


# This script is used to scrape the monitor product info from Canada Computers & Electronics
# Always run the scraper first before doing any data analysis

# Import python libraries

import requests
import csv
import time
import datetime
import pandas as pd

# Define current date

current_time = datetime.datetime.now()
date = str(current_time.year) + str(current_time.month) + str(current_time.day)

# Function to check if the item is new and not refurbished, open box, or other unwanted items
def is_new_item(name):
    name_lower = name.lower()
    unwanted_keywords = [
        'refurbished', 'open box', 'charger', 'adapter',
        'battery', 'sleeve', 'case', 'cable', 'custom', 'briefcase',
        'stand', 'lock', 'keyboard', 'fan', 'jack', 'drive', 'desktop', 'windows', 'processor',
        'laptop', 'printer', 'projector', 'tablet', 'televesion',
        'compatible', 'module'
    ]
    return not any(keyword in name_lower for keyword in unwanted_keywords)

# Function to fetch product data from a specific page
def fetch_products(page):
    url = 'https://www.bestbuy.ca/api/v2/json/search'
    params = {
        'query': 'dell monitor',
        'category': 'monitors',
        'condition': 'new',
        'page': page
    }
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to fetch page {page}: {response.status_code}")
        return None

# Main function to scrape data and save to CSV
def scrape_bestbuy_dell():
    products = []
    page = 1

    while True:
        print(f"Fetching page {page}")
        data = fetch_products(page)
        if data and 'products' in data and data['products']:
            for item in data['products']:
                name = item.get('name', 'N/A')
                sku = item.get('sku', 'N/A')
                price = item.get('salePrice', 'N/A')
                link = 'https://www.bestbuy.ca/en-ca/product/' + item.get('sku', 'N/A')
                if is_new_item(name):
                    products.append({
                        'Bestbuy_name': name,
                        'Bestbuy_sku': sku,
                        'Bestbuy_price': price,
                        'Bestbuy_link': link
                    })
            page += 1
            time.sleep(1)  # Short delay to avoid hitting rate limits
        else:
            break
    
    # Pull out the current date and include it in the csv
    current_time = datetime.datetime.now()
    date = str(current_time.year) + str(current_time.month) + str(current_time.day)
    
    # Write data to CSV
    with open(f'bestbuy_dell_monitor{date}.csv', 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['Bestbuy_name', 'Bestbuy_sku', 'Bestbuy_price', 'Bestbuy_link']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(products)

    print(f'Data scraped and saved to bestbuy_dell_monitor{date}.csv')
    #df = pd.read_csv(f'd:/brainstation/dropbox/bestbuy_dell_monitor{date}.csv')
    #display(df.head(10))

if __name__ == '__main__':
    scrape_bestbuy_dell()

