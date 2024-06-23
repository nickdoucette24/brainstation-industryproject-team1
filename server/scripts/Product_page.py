#!/usr/bin/env python
# coding: utf-8

# In[11]:


# This script is used to call out all products from all retailers and Dell
# Also has a search product function
# !!!Important note: run the scrapper first to obtain the daily csv before any data analysis!!!

# Import necessary libraries
import pandas as pd
import csv
import time
import datetime
import matplotlib.pyplot as plt
import numpy as np

# The followings are to define the date variable

current_time = datetime.datetime.now()
date = str(current_time.year) + str(current_time.month) + str(current_time.day)


# In[2]:


# Import all csv files saved daily
# Note that the index.csv is a local file. Make sure put the correct path to read it

index = pd.read_csv('index.csv')
dell = pd.read_csv(f'offcial_dell_monitor{date}.csv')
bestbuy = pd.read_csv(f'bestbuy_dell_monitor{date}.csv')
newegg = pd.read_csv(f'newegg_dell_monitor{date}.csv')
cce = pd.read_csv(f'cce_dell_monitor{date}.csv')


# In[3]:


# Merge the csv files into a big table

df = pd.merge(index, bestbuy, how = "left", on = ['Bestbuy_sku'])
df = pd.merge(df, newegg, how = "left", on = ['Newegg_sku'])
df = pd.merge(df, cce, how = "left", on = ['CCE_sku'])
df = pd.merge(df, dell, how = "inner", on = ['Dell_product'] )
df = df[['Dell_product', 'Dell_price', 'Bestbuy_price', 'Newegg_price', 'CCE_price']].sort_values('Dell_price', ascending = True)


# In[5]:


# Fill the 'null' value with an actual string

df = df.fillna('Not sold in this retailer')


# In[6]:


# Call the table that contains everything
# And print out summaries

display(df)
a = df['Bestbuy_price'].count()
b = df['Newegg_price'].count()
c = df['CCE_price'].count()
print(f'There are {df.shape[0]} products found on Dell.')
print(f'Bestbuy has {a} products.')
print(f'Newegg has {b} products.')
print(f'Canada Computers & Electronics has {c} products.')


# In[7]:


# Define a function to search the product name 

df['Dell_product'] = df['Dell_product'].astype(str)
def search_product(product_name):
    search_df = pd.DataFrame()
    for i in df['Dell_product']:
        if product_name in i:
            search_df = pd.concat([search_df, df[df['Dell_product'] == i]])
    display(search_df)


# In[10]:


# Demonstration of the searching function, delete the # below if you want to test it

# search_product('223')

