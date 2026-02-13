import pandas as pd
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin
import json

class HealthDataProcessor(BaseEstimator, TransformerMixin):
    """
    A class to process health sensor readings, handle missing data,
    and classify patient status based on biomarker thresholds.
    """
    
    def __init__(self):
        self.critical_thresholds = {
            'heart_rate': {'min': 60, 'max': 100},
            'oxygen_level': {'min': 95}
        }

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        """
        Cleans data and adds classification flags.
        
        Args:
            X (pd.DataFrame): Raw sensor data.
            
        Returns:
            pd.DataFrame: Processed dataframe with 'status' column.
        """
        X = X.copy()
        
        # Handle missing values: Fill with median for robust imputation
        X['heart_rate'] = X['heart_rate'].fillna(X['heart_rate'].median())
        X['oxygen_level'] = X['oxygen_level'].fillna(X['oxygen_level'].median())
        
        # Classification Logic
        X['status'] = X.apply(self._classify_row, axis=1)
        
        return X

    def _classify_row(self, row):
        """Helper to flag Critical vs Normal based on thresholds."""
        hr = row['heart_rate']
        oxy = row['oxygen_level']
        
        if (hr < self.critical_thresholds['heart_rate']['min'] or 
            hr > self.critical_thresholds['heart_rate']['max'] or 
            oxy < self.critical_thresholds['oxygen_level']['min']):
            return 'Critical'
        return 'Normal'

def export_summary(df):
    """
    Exports the processed summary as a JSON object for the web dashboard.
    """
    summary = {
        'total_readings': len(df),
        'critical_count': int(df[df['status'] == 'Critical'].shape[0]),
        'normal_count': int(df[df['status'] == 'Normal'].shape[0]),
        'records': df.to_dict(orient='records')
    }
    return json.dumps(summary, indent=2)

if __name__ == "__main__":
    # Example usage
    try:
        df = pd.read_csv('sensor_readings.csv')
        processor = HealthDataProcessor()
        processed_df = processor.transform(df)
        json_output = export_summary(processed_df)
        print(json_output)
    except FileNotFoundError:
        print("Error: sensor_readings.csv not found.")
