import csv
import json
import sys


def csv2dict(filename):
    with open(filename) as f:
        reader = csv.reader(f)

        header = reader.next()

        rows = list(reader)

        return map(lambda row: {k: v for k, v in zip(header, row)}, rows)


def concatenate(lists):
    return reduce(lambda a, b: a + b, lists, [])


def main():
    data = concatenate(map(csv2dict, sys.argv[1:]))

    print json.dumps(data, indent=2)


if __name__ == '__main__':
    sys.exit(main())
