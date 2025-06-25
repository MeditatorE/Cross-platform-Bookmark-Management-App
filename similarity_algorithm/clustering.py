import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from embedding import embed_texts


def perform_clustering():
    # 加载数据集
    df = pd.read_csv('text_dataset_100.csv')

    # 获取文本向量
    text_embeddings = embed_texts(df['text'].tolist())

    # 使用K-means进行聚类
    num_clusters = 4  # 假设我们希望将文本分为4类
    kmeans = KMeans(n_clusters=num_clusters, random_state=42)
    kmeans.fit(text_embeddings)

    # 获取聚类标签
    df['cluster'] = kmeans.labels_

    # 评估聚类效果
    silhouette_avg = silhouette_score(text_embeddings, kmeans.labels_)
    print(f"Silhouette Score: {silhouette_avg}")

    # 保存聚类结果和嵌入向量
    embeddings_df = pd.DataFrame(text_embeddings, columns=[f'embedding_{i}' for i in range(text_embeddings.shape[1])])
    result_df = pd.concat([df, embeddings_df], axis=1)
    result_df.to_csv('clustered_texts.csv', index=False)
    print("Clustering result stored at 'clustered_texts.csv'")


if __name__ == "__main__":
    perform_clustering()
