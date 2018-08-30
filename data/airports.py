import csv
import json
import sys


# Run this script on the airport data file from
# https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat.


def make_table(data):
    table = {}
    for row in data:
        table[row['code']] = {'lat': row['lat'], 'lon': row['lon']}
    return table

def load(filename):
    header = ['code', 'lat', 'lon']

    with open(filename) as f:
        reader = csv.reader(f)
        rows = list(reader)

        return map(lambda row: {k: v for k, v in zip(header, [row[4], row[6], row[7]])}, rows)


def main():
    data = load(sys.argv[1])
    print json.dumps(make_table(data))


if __name__ == '__main__':
    sys.exit(main())
