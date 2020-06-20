import sys, json, getopt, numpy as np
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import pickle
#import cPickle
def write_in(train_model, x_test, y_test):
    x_test = pickle.dumps(x_test)
    y_test = pickle.dumps(y_test)
    train_model = pickle.dumps(train_model)
    x_test = pickle.loads(x_test)
    y_test = pickle.loads(y_test)
    train_model = pickle.loads(train_model)
    test_dataset = tf.data.Dataset.from_tensor_slices((x_test, y_test))
    test_dataset = test_dataset.batch(64)
    results = train_model.evaluate(test_dataset)
    #results = train_model.evaluate(x_test, y_test, verbose=0)
    return results

def main(train_model, x_test, y_test):
    accuracy_results = write_in(train_model, x_test, y_test)
    return str(accuracy_results.to_json())

if __name__ == '__main__':
    main(sys.argv[0],sys.argv[1],sys.argv[2])
