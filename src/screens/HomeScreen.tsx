import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { HitokotoData } from '../types';

// 类型映射
const typeMap: { [key: string]: string } = {
  all: '所有类型',
  a: '动画',
  b: '漫画',
  c: '游戏',
  d: '文学',
  e: '原创',
  f: '来自网络',
  g: '其他',
  h: '影视',
  i: '诗词',
  j: '网易云',
  k: '哲学',
  l: '抖机灵'
};

export default function HomeScreen() {
  const [hitokoto, setHitokoto] = useState<HitokotoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');

  const fetchHitokoto = async (type: string = selectedType) => {
    try {
      const url = type === 'all'
        ? 'https://v1.hitokoto.cn/'
        : `https://v1.hitokoto.cn/?c=${type}`;
      const response = await fetch(url);
      const data: HitokotoData = await response.json();
      setHitokoto(data);
    } catch (error) {
      Alert.alert('错误', '获取一言失败，请检查网络连接');
      console.error('获取一言失败:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHitokoto();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHitokoto();
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setLoading(true);
    fetchHitokoto(type);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#34C759" />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>今日一言</Text>
        <Text style={styles.subtitle}>每日精选句子</Text>
      </View>

      {/* 类型选择器 */}
      <View style={styles.typeSelector}>
        <Text style={styles.typeSelectorTitle}>选择类型：</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.typeScrollView}
          contentContainerStyle={styles.typeScrollContent}
        >
          {Object.entries(typeMap).map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.typeButton,
                selectedType === key && styles.typeButtonActive
              ]}
              onPress={() => handleTypeChange(key)}
            >
              <Text style={[
                styles.typeButtonText,
                selectedType === key && styles.typeButtonTextActive
              ]}>
                {value}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {hitokoto && (
        <View style={styles.card}>
          <Text style={styles.hitokotoText}>"{hitokoto.hitokoto}"</Text>
          
          <View style={styles.divider} />
          
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>出处：</Text>
              <Text style={styles.infoValue}>{hitokoto.from}</Text>
            </View>
            
            {hitokoto.from_who && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>作者：</Text>
                <Text style={styles.infoValue}>{hitokoto.from_who}</Text>
              </View>
            )}
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>类型：</Text>
              <Text style={styles.infoValue}>{getTypeText(hitokoto.type)}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>长度：</Text>
              <Text style={styles.infoValue}>{hitokoto.length} 字</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>添加时间：</Text>
              <Text style={styles.infoValue}>{formatDate(hitokoto.created_at)}</Text>
            </View>
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
        <Text style={styles.refreshButtonText}>
          {selectedType === 'all' ? '获取新的一言' : `获取新的${typeMap[selectedType]}一言`}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function getTypeText(type: string): string {
  return typeMap[type] || '未知';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: '#34C759',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  card: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hitokotoText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: 20,
  },
  infoSection: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    width: 80,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  refreshButton: {
    backgroundColor: '#34C759',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  typeSelector: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  typeSelectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  typeScrollView: {
    flexGrow: 0,
  },
  typeScrollContent: {
    paddingRight: 10,
  },
  typeButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  typeButtonActive: {
    backgroundColor: '#34C759',
    borderColor: '#34C759',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: 'white',
  },
});
