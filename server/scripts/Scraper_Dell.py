#!/usr/bin/env python
# coding: utf-8

# In[1]:


# This script is used to scrape the monitor product info from Canada Computers & Electronics
# Always run the scraper first before doing any data analysis

# Import python libraries


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


# Get total product and page number first
# As we are automating looping through all pages

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
url = f'https://www.dell.com/en-ca/search/monitor?p=1&t=Product'
response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.content, 'html.parser')
pageinfo = soup.find('p', class_ = 'pageinfo')
pageinfo = str(pageinfo)
pageinfo = ''.join(c for c in pageinfo if c in digits)
total_product = int(pageinfo[3:])
if total_product // 12 == 0:
    page_loop = total_product // 12 + 1
else:
    page_loop = total_product // 12 + 2

print('Total products we found: ',total_product)
print('Loop through this many pages: ', page_loop - 1)


# In[4]:


def scrape_dell_monitor():
    
    # Create all the dummy variables
    product_name = []
    product_id = []
    specs = []
    price = []
    link = []
    price_holder_2 = []
    spec_holder_2 = []
    spec_holder_3 = []
    
    headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    # Run this part to get the html info from the url we wanted
    # and loop it through the pages that we defined earlier
    
    for i in range(1, page_loop):
        url = f'https://www.dell.com/en-ca/search/monitor?p={i}&t=Product'
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # These variables are temporary holders for the data that we want
        product_name_holder = soup.find_all('h3', class_ = 'ps-title')
        product_id_holder = soup.find_all('div', class_='ps-product-detail-info')
        price_holder = soup.find_all('div', class_ = 'ps-dell-price ps-simplified')
        spec_holder = soup.find_all('div', class_ = 'ps-snp-tech-specs ps-icon-specs-container')
        link_holder = soup.find_all('h3', class_ = 'ps-title')
        
        # The following FOR loops are to clean the temporary holders that we fetched above
        
        for a in product_name_holder:
            a = a.get_text().strip('\n')
            product_name.append(a)
            
        for b in product_id_holder:
            b = b.get_text().strip('\n')#.strip('Order Code')
            product_id.append(b)
        
        for d in price_holder:
            d = d.get_text().strip('\n')
            d = d.split(' ')[-1]
            d = d.strip('$')
            d = d.replace(',', '')
            d = float(d)
            price_holder_2.append(d)
        
        for f in range (0, len(spec_holder)):
            spec_holder_2 = spec_holder[f].find_all('span', class_ = 'ps-iconography-specs-label')
            for g in spec_holder_2:
                g = g.get_text().strip('\n').strip('  ').strip('\n')
                spec_holder_3.append(g)
            specs.append(spec_holder_3)
            spec_holder_3 = []
        
        for h in link_holder:
            h = str(h)
            h = h.split('//')[-1].split('"')[0]
            link.append(h)
        
        print(f'fetching page {i}')
        i+=1
        
    for e in range(0, len(price_holder_2), 2):
        price.append(price_holder_2[e])
        

    print(len(product_name))
    print(len(product_id))
    print(len(price))
    print(len(specs))
    print(len(link))
    
    # Put the data in a dataframe
    print('Below is the 10 rows of the fetched data:')
    dict = {'Dell_product': product_name, 'Dell_product_id': product_id, 'Dell_price' : price, 'Dell_specs' : specs, 'Dell_link': link }
    
    Dell_monitor = pd.DataFrame(dict)
    
    display(Dell_monitor.head(10))
    
    # Write data to csv
    Dell_monitor.to_csv(f'offcial_dell_monitor{date}.csv')
    print(f'Data scraped and saved to official_dell_monitor{date}.csv')

# Run this function
if __name__ == '__main__':
    scrape_dell_monitor()

