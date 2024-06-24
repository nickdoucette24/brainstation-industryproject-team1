#!/usr/bin/env python
# coding: utf-8

# !!!Important note: run the scraper first to obtain the daily CSV before any data analysis!!!
# This script is for comparing the price difference between Dell and Newegg

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
newegg_path = os.path.join(data_dir, f'newegg_dell_monitor_{date}.csv')
newegg = pd.read_csv(newegg_path)
newegg['Newegg_price'] = newegg['Newegg_price'].astype(float)

# Merge the CSVs into a big table
df = pd.merge(index, newegg, how="left", on=['Newegg_sku'])
df = pd.merge(df, dell, how="left", on=['Dell_product'])
df = df[['Dell_product', 'Newegg_sku', 'Newegg_price', 'Dell_price']]
df.dropna(axis=0, inplace=True)

# Create a new column of how the retailer's price is different from Dell's price
df['Price_dif'] = df['Newegg_price'] - df['Dell_price']

offender = df.sort_values('Price_dif', ascending=True)

# We are separating "offenders" from "deviated"
# 'Offenders' means the products that the retailer undercutting Dell
# 'Deviated' means the products that sold with different price with Dell
offender = df.loc[df['Price_dif'] < 0].sort_values('Price_dif', ascending=True)
deviated = df.loc[df['Price_dif'] != 0].sort_values('Price_dif', ascending=True)

# The followings are to provide some headers

# Total products sold with this retailer
print(f'Total products listed here are {df.shape[0]}.')

# Total offending products from this retailer
print(f'Total offending products are {offender.shape[0]}.')

# Total deviated products
print(f'Total deviated products are {deviated.shape[0]}.')

# Compliance rate
print(f'The compliance rate is {round((df.shape[0] - offender.shape[0]) / df.shape[0] * 100)}%.')

# Commenting out the charts
# List the offending products with a descending order in a bar chart
# plt.figure()
# plt.bar(offender['Dell_product'], offender['Price_dif'])
# plt.xticks(rotation=-45)
# plt.ylabel('Price difference in $CAD')
# plt.xlabel('Dell product')
# plt.show()

# Make a line graph showing the deviation percentage of each product from this retailer
df['Deviation'] = df['Price_dif'] / df['Dell_price'] * 100
df_deviation_order = df.sort_values('Deviation', ascending=True)

# plt.figure()
# plt.plot(df_deviation_order['Dell_product'], df_deviation_order['Deviation'])
# plt.xticks(rotation=-45)
# plt.title('The deviation % of Newegg\'s price comparing to Dell MSRP')
# plt.ylabel('Price deviation %')
# plt.xlabel('Dell product')
# plt.show()

# Calculate avg. deviation
dev_perc = round(df['Deviation'].mean(), 2)
print(f'The average deviation for this retailer is: {dev_perc}%.')

# Categorize deviation percentage into colored status
conditions = [
    (df['Deviation'] >= 0),
    (df['Deviation'] < 0) & (df['Deviation'] >= -10),
    (df['Deviation'] < -10)
]
status = ['Green', 'Yellow', 'Red']
df['Status'] = np.select(conditions, status, default='Unknown')

print(df[['Dell_product', 'Dell_price', 'Newegg_price', 'Deviation', 'Status']].sort_values('Deviation', ascending=True))

# Save comparison results as CSV
save_path = os.path.join(data_dir, f'newegg_comparison_{date}.csv')
df[['Dell_product', 'Dell_price', 'Newegg_price', 'Deviation', 'Status']].sort_values('Deviation', ascending=True).to_csv(save_path, index=False)
print(f"Comparison results saved to {save_path}")