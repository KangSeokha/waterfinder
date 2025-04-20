import os 

from pyspark.sql import SparkSession
from pyspark.sql.functions import col, when
from pyspark.sql.types import StructType, StructField, StringType, IntegerType, FloatType

import time
import tracemalloc


# Function to standardize column headers
def standardizeColumnHeader(df):
    column_headers = [x.replace(" ", "_").upper() for x in df.columns.to_list()]
    df.columns = column_headers
    return df

#Loading datasets
PATH= r'data/'
OUT_PATH = r'prcs_data_web/'
well_completion_data_file = r'WCR_v4_2024.txt'
gwl_daily_file = 'gwl-daily.csv'
gwl_monthly_file = 'gwl-monthly.csv'
gwl_stations_file = 'gwl-stations.csv'
gwl_quality_cd_file = 'gwl-quality_codes.csv'

def dataProcessing():
    # Initialize Spark session
    spark = SparkSession.builder.appName("WellCompletionDataProcessing").getOrCreate()

    # Load data into Spark DataFrame
    well_completion_data = spark.read.csv(
        os.path.join(PATH, well_completion_data_file),
        sep=",",
        header=True,
        # encoding='cp437',
        mode='DROPMALFORMED'
    )
    print("Initial shape of the raw_data: ", (well_completion_data.count(), len(well_completion_data.columns)))

    wcr_fltr = well_completion_data.filter(
        (col("DD_LONGITUDE").isNotNull()) & (col("DD_LATITUDE").isNotNull())
    )

    print("Dropping columns without Spatial Information: ", (wcr_fltr.count(), len(wcr_fltr.columns)))

    # Drop unnecessary columns
    columns_to_drop = ['Orientation', 'USGS_SiteNumber', 'DWR_StateWellNumber', 
                    'USGS_NWIS_URL', 'USGS_GAMAID', 'SWRCB_DomesticWellNumber',
                    'SWRCB_DDW_PublicSupplyWell', 'SWRCB_DDW_PublicSupplyWell_2022Code', 
                    'CASGEM_WellNumber', 'CASGEM_Status', 'OSWCR_URL', 'LocalAgency',
                    'DR_FirstPublished', 'Lithology_Transcribed', 'SealDepth', 
                    'SealMaterial', 'OwnerWellNo', 'StaticWaterLevel', 'TopOfPerfInterval',
                    'BottomOfPerfInterval', 'Address', 'City', 'AddressFrom', 'APN', 
                    'APNFrom', 'Remark', 'REFERENCE']

    wcr_fltr = wcr_fltr.drop(*columns_to_drop)


    # Standardize column headers
    wcr_fltr = wcr_fltr.toDF(*[x.replace(" ", "_").upper() for x in wcr_fltr.columns])


    # Define a dictionary with default values based on dtype and apply them
    dtype_dict = {
        'WCRNUMBER': 'str', 'WCRN': 'str', 'LEGACYLOGNO': 'str', 'COUNTY': 'str', 
        'MTRS': 'str', 'ACTIVITY': 'str', 'PLANNEDUSE': 'str', 'DATEWELLCOMPLETED': 'str', 
        'YEARWELLCOMPLETED': 'int', 'HOLEDEPTH': 'float', 'COMPLETEDDEPTH': 'float', 
        'TOPOFOPENINGS': 'float', 'NUMBEROPENINTERVALS': 'float', 'GENERALIZEDLITHOLOGY': 'str', 
        'DRILLINGCOMPANY': 'str', 'DRILLERLICENSENO': 'str', 'DD_LONGITUDE': 'float', 
        'DD_LATITUDE': 'float', 'DATUM': 'str', 'LOCATION_FROM': 'str'
    }

    # Replacing NULL values
    for column, dtype in dtype_dict.items():
        na_value = 'NA' if dtype == 'str' else 0
        wcr_fltr = wcr_fltr.withColumn(
            column,
            when(col(column).isNull(), na_value).otherwise(col(column))
        )
    print("Replaced NULL Values")

    # Convert columns to their designated data types
    for column, dtype in dtype_dict.items():
        if dtype == 'int':
            wcr_fltr = wcr_fltr.withColumn(column, col(column).cast(IntegerType()))
        elif dtype == 'float':
            wcr_fltr = wcr_fltr.withColumn(column, col(column).cast(FloatType()))
        elif dtype == 'str':
            wcr_fltr = wcr_fltr.withColumn(column, col(column).cast(StringType()))

    # Show the final shape and sample data
    print("Final Shape of the dataframe: ", (wcr_fltr.count(), len(wcr_fltr.columns)))

    return wcr_fltr 

if __name__=="__main__":
    tracemalloc.start() 
    start_time = time.time()
    processed_data = dataProcessing()
    end_time = time.time()
    current, peak = tracemalloc.get_traced_memory()

    runtime = end_time - start_time
    print("Peak Memory Used: ", peak)
    print("Total runtime: ", runtime)
    processed_data.write.format("csv").save(os.path.join(OUT_PATH, 'well_completion_data_prcs.csv'))


