#!/usr/bin/env python
# coding: utf-8

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
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# The followings are to define the date variable
current_time = datetime.datetime.now()
date = str(current_time.year) + str(current_time.month).zfill(2) + str(current_time.day).zfill(2)

# Directory paths
script_dir = os.path.dirname(__file__)
data_dir = os.path.join(script_dir, 'data')

# Import all csv files saved daily
# Note that the index.csv is a local file. Make sure to put the correct path to read it
index_path = os.path.join(script_dir, 'index.csv')
dell_path = os.path.join(data_dir, f'official_dell_monitor_{date}.csv')
bestbuy_path = os.path.join(data_dir, f'bestbuy_dell_monitor_{date}.csv')
newegg_path = os.path.join(data_dir, f'newegg_dell_monitor_{date}.csv')

index = pd.read_csv(index_path)
dell = pd.read_csv(dell_path)
bestbuy = pd.read_csv(bestbuy_path)
newegg = pd.read_csv(newegg_path)

# Merge the csv files into a big table
df = pd.merge(index, bestbuy, how="left", on=['Bestbuy_sku'])
df = pd.merge(df, newegg, how="left", on=['Newegg_sku'])
df = pd.merge(df, dell, how="inner", on=['Dell_product'])
df = df[['Dell_product', 'Dell_price', 'Bestbuy_price', 'Newegg_price']].sort_values('Dell_price', ascending=True)

# Fill the 'null' value with an actual string
df = df.fillna('Not sold in this retailer')

# Call the table that contains everything
# And print out summaries
print(df)
a = df['Bestbuy_price'].count()
b = df['Newegg_price'].count()
print(f'There are {df.shape[0]} products found on Dell.')
print(f'Bestbuy has {a} products.')
print(f'Newegg has {b} products.')

# Define a function to search the product name
df['Dell_product'] = df['Dell_product'].astype(str)
def search_product(product_name):
    search_df = pd.DataFrame()
    for i in df['Dell_product']:
        if product_name in i:
            search_df = pd.concat([search_df, df[df['Dell_product'] == i]])
    print(search_df)

# Demonstration of the searching function, delete the # below if you want to test it
# search_product('223')