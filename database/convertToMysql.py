import re
from datetime import datetime

# Path to your original SQL dump file
input_file_path = 'database_dump.sql'
# Path to the modified SQL file to be generated
output_file_path = 'modified_database_dump.sql'

# Regular expression to match ISO 8601 datetime format in the dump
timestamp_regex = re.compile(r'\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z')

def convert_timestamp(match):
    # Extract the matched timestamp
    timestamp_str = match.group(0)
    # Parse the timestamp into a datetime object
    timestamp = datetime.strptime(timestamp_str, '%Y-%m-%dT%H:%M:%S.%fZ')
    # Convert the datetime object to MySQL's DATETIME format string
    return timestamp.strftime('%Y-%m-%d %H:%M:%S')

with open(input_file_path, 'r') as input_file, open(output_file_path, 'w') as output_file:
    for line in input_file:
        # Replace all matching timestamps in the line
        modified_line = timestamp_regex.sub(convert_timestamp, line)
        # Write the modified line to the output file
        output_file.write(modified_line)

print('Dump file modification complete. Modified file saved as:', output_file_path)
