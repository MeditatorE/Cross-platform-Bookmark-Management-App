import data_preparation
import clustering
import visualization


if __name__ == "__main__":
    data_preparation.create_dataset()
    clustering.perform_clustering()
    visualization.visualize_clusters()