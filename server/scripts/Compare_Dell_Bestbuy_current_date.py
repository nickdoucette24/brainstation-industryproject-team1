#!/usr/bin/env python
# coding: utf-8

# !!!Important note: run the scraper first to obtain the daily CSV before any data analysis!!!
# This script is for comparing the price difference between Dell and BestBuy

# Import necessary libraries
import pandas as pd
import numpy as np
import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Prepare the variables
current_time = datetime.datetime.now()
date = str(current_time.year) + str(current_time.month).zfill(2) + str(current_time.day).zfill(2)

# Directory paths
script_dir = os.path.dirname(__file__)
data_dir = os.path.join(script_dir, 'data')

# Import all CSVs needed for this comparison
index_path = os.path.join(script_dir, 'index.csv')
index = pd.read_csv(index_path)
dell_path = os.path.join(data_dir, f'official_dell_monitor_{date}.csv')
dell = pd.read_csv(dell_path)
bestbuy_path = os.path.join(data_dir, f'bestbuy_dell_monitor_{date}.csv')
bestbuy = pd.read_csv(bestbuy_path)
bestbuy['Bestbuy_price'] = bestbuy['Bestbuy_price'].astype(float)

# Merge the CSVs into a big table
df = pd.merge(index, bestbuy, how="left", on=['Bestbuy_sku'])
df = pd.merge(df, dell, how="left", on=['Dell_product'])
df = df[['Dell_product', 'Bestbuy_sku', 'Bestbuy_price', 'Dell_price']]
df.dropna(axis=0, inplace=True)

# Create a new column of how the retailer's price is different from Dell's price
df['Price_dif'] = df['Bestbuy_price'] - df['Dell_price']

# Calculate the deviation
df['Deviation'] = (df['Price_dif'] / df['Dell_price']) * 100

# Offenders: products where BestBuy price is less than Dell price
offender = df.loc[df['Price_dif'] < 0].sort_values('Price_dif', ascending=True)

# Deviated: products where BestBuy price is not equal to Dell price
deviated = df.loc[df['Price_dif'] != 0].sort_values('Price_dif', ascending=True)

# Total products sold with this retailer
total_products = df.shape[0]
print(f'Total products listed here are {total_products}.')

# Total offending products from this retailer
total_offending_products = offender.shape[0]
print(f'Total offending products are {total_offending_products}.')

# Total deviated products
total_deviated_products = deviated.shape[0]
print(f'Total deviated products are {total_deviated_products}.')

# Compliance rate
compliant_products = df.loc[df['Price_dif'] == 0].shape[0]
compliance_rate = (compliant_products / total_products) * 100
print(f'The compliance rate is {round(compliance_rate, 2)}%.')

# Categorize deviation percentage into colored status
conditions = [
    (df['Deviation'] >= 0),
    (df['Deviation'] < 0) & (df['Deviation'] >= -10),
    (df['Deviation'] < -10)
]
status = ['Green', 'Yellow', 'Red']
df['Status'] = np.select(conditions, status, default='Unknown')

# Print the DataFrame for verification
print(df[['Dell_product', 'Dell_price', 'Bestbuy_price', 'Deviation', 'Status']].sort_values('Deviation', ascending=True))

# Save comparison results as CSV
save_path = os.path.join(data_dir, f'bestbuy_comparison_{date}.csv')
df[['Dell_product', 'Dell_price', 'Bestbuy_price', 'Deviation', 'Status']].sort_values('Deviation', ascending=True).to_csv(save_path, index=False)
print(f"Comparison results saved to {save_path}")