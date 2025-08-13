import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const handleTakePhoto = async () => {
    try {
      // 请求相机权限
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('权限不足', '需要相机权限才能拍照');
        return;
      }

      // 启动相机
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAvatarUri(result.assets[0].uri);
        Alert.alert('成功', '头像已更新！');
      }
    } catch (error) {
      Alert.alert('错误', '拍照失败，请重试');
      console.error('拍照错误:', error);
    }
  };

  const handleMenuPress = (title: string) => {
    if (title === '编辑资料') {
      handleTakePhoto();
    } else {
      Alert.alert('提示', `您点击了 ${title}`);
    }
  };

  const menuItems = [
    { icon: 'person-outline', title: '个人信息', subtitle: '编辑您的个人资料' },
    { icon: 'settings-outline', title: '设置', subtitle: '应用设置和偏好' },
    { icon: 'notifications-outline', title: '通知', subtitle: '消息推送设置' },
    { icon: 'shield-checkmark-outline', title: '隐私', subtitle: '隐私和安全设置' },
    { icon: 'help-circle-outline', title: '帮助', subtitle: '常见问题和支持' },
    { icon: 'information-circle-outline', title: '关于', subtitle: '应用版本和信息' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* 头部用户信息 */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={40} color="white" />
            )}
          </View>
        </View>
        <Text style={styles.userName}>用户名</Text>
        <Text style={styles.userEmail}>alterem@alterem.com</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => handleMenuPress('编辑资料')}
        >
          <Text style={styles.editButtonText}>编辑资料</Text>
        </TouchableOpacity>
      </View>

      {/* 统计信息 */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>42</Text>
          <Text style={styles.statLabel}>收藏</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>128</Text>
          <Text style={styles.statLabel}>浏览</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>15</Text>
          <Text style={styles.statLabel}>分享</Text>
        </View>
      </View>

      {/* 菜单列表 */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => handleMenuPress(item.title)}
          >
            <View style={styles.menuLeft}>
              <Ionicons 
                name={item.icon as any} 
                size={24} 
                color="#666" 
                style={styles.menuIcon}
              />
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      {/* 退出登录按钮 */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => Alert.alert('确认', '确定要退出登录吗？')}
      >
        <Text style={styles.logoutButtonText}>退出登录</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>HitokotoApp v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  statsContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingVertical: 20,
    marginTop: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  menuContainer: {
    backgroundColor: 'white',
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    marginHorizontal: 20,
    marginTop: 30,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});
