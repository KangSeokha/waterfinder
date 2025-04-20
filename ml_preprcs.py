from pyspark.sql import SparkSession
from pyspark.sql.functions import col, mean, lit, when, split, year
from pyspark.sql.types import StringType
import os

import tracemalloc
import time

# Create Spark session
spark = SparkSession.builder.appName("Groundwater Data Processing").getOrCreate()

# Paths
PATH = r'data/'
OUT_PATH = r'prcs_data_ml/'
gwl_monthly_file = 'gwl-monthly.csv'
gwl_stations_file = 'gwl-stations.csv'


def mlDataPreprocessing():

    spark = SparkSession.builder.appName("Groundwater Data Processing").getOrCreate()

    # Load data
    gwl_monthly = spark.read.csv(
        os.path.join(PATH, gwl_monthly_file),
        sep=",",
        # schema=schema,
        header=True,
        # encoding='cp437',
    )
    gwl_stations = spark.read.csv(f'{PATH}/{gwl_stations_file}', header=True, inferSchema=True)

    print((gwl_monthly.count(), len(gwl_monthly.columns)))
    print((gwl_stations.count(), len(gwl_stations.columns)))

    # Select relevant columns
    gwl_monthly = gwl_monthly.select('STATION', 'MSMT_DATE', 'GSE_WSE', 'WLM_RPE', 'WSE', 'RPE_WSE', 
                                    'WLM_GSE', 'WLM_RPE_QC', 'WLM_GSE_QC', 'RPE_WSE_QC', 
                                    'GSE_WSE_QC', 'WSE_QC')

    # Drop unnecessary columns
    gwl_stations = gwl_stations.drop('ELEVDATUM', 'BASIN_CODE', 'COMMENT', 'WDL')

    # Select features and handle missing values for categorical columns
    # columns_one_hot = ['COUNTY_NAME', 'BASIN_NAME', 'WELL_USE', 'WELL_TYPE']
    # for column in columns_one_hot:
    #     gwl_stations = gwl_stations.withColumn(column, when(col(column).isNull(), lit('OTHER')).otherwise(col(column)))

    gwl_stations_feat = gwl_stations.select('STATION', 'ELEV', 'COUNTY_NAME', 'BASIN_NAME', 'WELL_DEPTH', 'WELL_USE', 'WELL_TYPE')

    # Merge data
    final_db = gwl_monthly.join(gwl_stations_feat, on='STATION', how='inner')

    # Aggregate data by COUNTY_NAME and MSMT_DATE
    final_db1 = final_db.groupBy('COUNTY_NAME', 'MSMT_DATE').agg(
        mean('GSE_WSE').alias('GSE_WSE'),
        mean('WLM_RPE').alias('WLM_RPE'),
        mean('WSE').alias('WSE'),
        mean('RPE_WSE').alias('RPE_WSE'),
        mean('WLM_GSE').alias('WLM_GSE')
    )

    # Create index for cross join
    counties = final_db1.select('COUNTY_NAME').distinct()
    dates = final_db1.select('MSMT_DATE').distinct().orderBy('MSMT_DATE')

    index_db = counties.crossJoin(dates)

    # Perform left join with index_db
    final_db2 = index_db.join(final_db1, on=['COUNTY_NAME', 'MSMT_DATE'], how='left')

    # Extract year and sort
    final_db2 = final_db2.withColumn('YEAR', year(col('MSMT_DATE')))
    final_db2 = final_db2.orderBy('COUNTY_NAME', 'MSMT_DATE')

    # Filter for specific counties and years
    county_ls = ['Butte', 'Colusa', 'Glenn', 'Plumas', 'Sacramento', 'San Joaquin', 
                'Shasta', 'Solano', 'Sutter', 'Tehama', 'Yolo', 'Yuba']
    final_db2 = final_db2.filter(
        (col('COUNTY_NAME').isin(county_ls)) & 
        (col('YEAR') >= 2010) & 
        (col('YEAR') <= 2023)
    )

    # Fill missing values for specific columns by county and year
    column_ls = ['GSE_WSE', 'WLM_RPE', 'WSE', 'RPE_WSE', 'WLM_GSE']

    final_db3 = spark.createDataFrame([], schema=final_db2.schema)

    for county in county_ls:
        temp_db = final_db2.filter((col('COUNTY_NAME') == county))
        for column in column_ls:
            # temp_db = temp_db.withColumn(column, when(col(column).isNull(), lit(None)).otherwise(col(column)))
            mean_value = temp_db.select(mean(col(column)).alias('mean_value')).first()['mean_value']
            if mean_value is not None:
                temp_db = temp_db.fillna({column: mean_value})
        final_db3 = final_db3.union(temp_db)

    print("Final Data Shape:", final_db3.count(), len(final_db3.columns))

    return final_db3

if __name__=="__main__":
    tracemalloc.start() 
    start_time = time.time()
    processed_data = mlDataPreprocessing()
    end_time = time.time()
    current, peak = tracemalloc.get_traced_memory()
    if not os.path.exists(OUT_PATH):
        os.makedirs(OUT_PATH)
    
    runtime = end_time - start_time
    print("Peak Memory Used: ", peak)
    print("Total runtime: ", runtime)
    processed_data.write.format("csv").save(os.path.join(OUT_PATH, 'ml_model_data.csv'))