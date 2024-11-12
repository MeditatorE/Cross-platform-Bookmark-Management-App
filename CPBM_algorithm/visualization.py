import pandas as pd
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA


def visualize_clusters():
    # 加载数据集
    df = pd.read_csv('clustered_texts.csv')

    # 获取文本向量
    embedding_columns = [col for col in df.columns if col.startswith('embedding_')]
    text_embeddings = df[embedding_columns].values

    # 使用PCA降维到2D
    pca = PCA(n_components=2)
    reduced_embeddings = pca.fit_transform(text_embeddings)

    # 可视化
    plt.figure(figsize=(10, 7))
    num_clusters = df['cluster'].nunique()
    for i in range(num_clusters):
        cluster_points = reduced_embeddings[df['cluster'] == i]
        plt.scatter(cluster_points[:, 0], cluster_points[:, 1], label=f'Cluster {i}')
    plt.legend()
    plt.title("Text Clusters Visualization")
    plt.xlabel("PCA Component 1")
    plt.ylabel("PCA Component 2")
    plt.show()


if __name__ == "__main__":
    visualize_clusters()
