import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
  Dimensions,
  Animated,
  Modal,
  Platform,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

export default function StyleScreen() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [inputValue, setInputValue] = useState('Alterem');
  const [selectedTab, setSelectedTab] = useState(0);
  const [animatedValue] = useState(new Animated.Value(0));
  
  const [fabExpanded, setFabExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [fabAnimation] = useState(new Animated.Value(0));
  const [notificationAnimation] = useState(new Animated.Value(-100));
  
  // 拖拽相关状态
  const [dragPosition] = useState(new Animated.ValueXY({ x: 50, y: 50 }));
  
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        dragPosition.setOffset({
          x: (dragPosition.x as any)._value,
          y: (dragPosition.y as any)._value,
        });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: dragPosition.x, dy: dragPosition.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        dragPosition.flattenOffset();
        
        const maxX = width - 180;
        const maxY = 150;
        const minX = 0;
        const minY = 0;
        
        const currentX = (dragPosition.x as any)._value;
        const currentY = (dragPosition.y as any)._value;
        
        const newX = Math.max(minX, Math.min(maxX, currentX));
        const newY = Math.max(minY, Math.min(maxY, currentY));
        
        if (currentX !== newX || currentY !== newY) {
          Animated.spring(dragPosition, {
            toValue: { x: newX, y: newY },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const startAnimation = () => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 悬浮按钮动画
  const toggleFab = () => {
    const toValue = fabExpanded ? 0 : 1;
    setFabExpanded(!fabExpanded);
    
    Animated.spring(fabAnimation, {
      toValue,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  // 顶部通知
  const showNotificationAlert = () => {
    setShowNotification(true);
    
    Animated.sequence([
      Animated.timing(notificationAnimation, {
        toValue: 20,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2500),
      Animated.timing(notificationAnimation, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowNotification(false);
    });
  };

  // 系统提醒
  const showSystemAlert = () => {
    Alert.alert(
      '系统通知',
      '这是一个系统级的通知提醒',
      [
        { text: '取消', style: 'cancel' },
        { text: '确定', onPress: () => console.log('用户点击了确定') },
      ],
      { cancelable: false }
    );
  };

  // 弹窗对话框
  const showModalDialog = () => {
    setShowModal(true);
  };

  // 遮罩效果
  const showOverlayMask = () => {
    setShowOverlay(true);
    setTimeout(() => {
      setShowOverlay(false);
    }, 3000);
  };

  const animatedStyle = {
    transform: [{
      scale: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.2],
      }),
    }],
    opacity: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.7],
    }),
  };

  const fabSubButtonStyle = (index: number) => ({
    transform: [
      {
        translateY: fabAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -(60 * (index + 1))],
        }),
      },
      {
        scale: fabAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
    ],
    opacity: fabAnimation,
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.pageTitle}>React Native 样式大全</Text>

        {/* 交互功能演示 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚀 交互功能演示</Text>
          <Text style={styles.sectionDescription}>各种交互效果和用户反馈</Text>
          
          <View style={styles.interactionDemo}>
            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={showNotificationAlert}
            >
              <Ionicons name="notifications" size={20} color="white" />
              <Text style={styles.buttonText}>顶部通知</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.alertButton}
              onPress={showSystemAlert}
            >
              <Ionicons name="warning" size={20} color="white" />
              <Text style={styles.buttonText}>系统提醒</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalButton}
              onPress={showModalDialog}
            >
              <Ionicons name="layers" size={20} color="white" />
              <Text style={styles.buttonText}>弹窗对话框</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.overlayButton}
              onPress={showOverlayMask}
            >
              <Ionicons name="eye" size={20} color="white" />
              <Text style={styles.buttonText}>遮罩效果</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Flexbox 布局演示 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Flexbox 布局演示</Text>
          <Text style={styles.sectionDescription}>展示不同的 Flexbox 布局方式</Text>
          
          <View style={styles.flexDemo}>
            <Text style={styles.demoLabel}>Row 布局 (flexDirection: 'row')</Text>
            <View style={styles.flexRowContainer}>
              <View style={[styles.flexItem, { backgroundColor: '#FF6B6B' }]}>
                <Text style={styles.flexItemText}>Flex 1</Text>
              </View>
              <View style={[styles.flexItem, { backgroundColor: '#4ECDC4' }]}>
                <Text style={styles.flexItemText}>Flex 1</Text>
              </View>
              <View style={[styles.flexItem, { backgroundColor: '#45B7D1' }]}>
                <Text style={styles.flexItemText}>Flex 1</Text>
              </View>
            </View>

            <Text style={styles.demoLabel}>Column 布局 (flexDirection: 'column')</Text>
            <View style={styles.flexColumnContainer}>
              <View style={[styles.flexItemSmall, { backgroundColor: '#96CEB4' }]}>
                <Text style={styles.flexItemText}>A</Text>
              </View>
              <View style={[styles.flexItemSmall, { backgroundColor: '#FFEAA7' }]}>
                <Text style={styles.flexItemText}>B</Text>
              </View>
              <View style={[styles.flexItemSmall, { backgroundColor: '#DDA0DD' }]}>
                <Text style={styles.flexItemText}>C</Text>
              </View>
            </View>

            <Text style={styles.demoLabel}>对齐方式演示</Text>
            <View style={styles.alignmentDemo}>
              <View style={styles.alignmentBox}>
                <Text style={styles.alignmentLabel}>Center</Text>
                <View style={[styles.alignmentContent, styles.centerAlignment]}>
                  <View style={styles.dot} />
                </View>
              </View>
              <View style={styles.alignmentBox}>
                <Text style={styles.alignmentLabel}>Flex Start</Text>
                <View style={[styles.alignmentContent, styles.flexStartAlignment]}>
                  <View style={styles.dot} />
                </View>
              </View>
              <View style={styles.alignmentBox}>
                <Text style={styles.alignmentLabel}>Flex End</Text>
                <View style={[styles.alignmentContent, styles.flexEndAlignment]}>
                  <View style={styles.dot} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 按钮样式集合 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔘 按钮样式集合</Text>
          <Text style={styles.sectionDescription}>各种常用的按钮设计样式</Text>
          
          <View style={styles.buttonGrid}>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>主要按钮</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>次要按钮</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.outlineButton}>
              <Text style={styles.outlineButtonText}>边框按钮</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.dangerButton}>
              <Text style={styles.dangerButtonText}>危险按钮</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.successButton}>
              <Text style={styles.successButtonText}>成功按钮</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.warningButton}>
              <Text style={styles.warningButtonText}>警告按钮</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="heart" size={20} color="white" />
              <Text style={styles.iconButtonText}>图标按钮</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.roundButton}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.buttonSizes}>
            <Text style={styles.demoLabel}>按钮尺寸</Text>
            <TouchableOpacity style={styles.largeButton}>
              <Text style={styles.largeButtonText}>大按钮</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mediumButton}>
              <Text style={styles.mediumButtonText}>中按钮</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallButton}>
              <Text style={styles.smallButtonText}>小按钮</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 卡片设计 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🃏 卡片设计</Text>
          <Text style={styles.sectionDescription}>不同风格的卡片布局</Text>
          
          <View style={styles.basicCard}>
            <Text style={styles.cardTitle}>基础卡片</Text>
            <Text style={styles.cardContent}>
              这是一个示例卡片，展示了阴影效果、圆角边框和内边距的使用。
              React Native 的样式系统基于 Flexbox，提供了强大的布局能力。
            </Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardDate}>2025-08-13</Text>
              <TouchableOpacity style={styles.cardButton}>
                <Text style={styles.cardButtonText}>查看更多</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.imageCard}>
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image" size={40} color="#ccc" />
              <Text style={styles.imagePlaceholderText}>图片占位符</Text>
            </View>
            <View style={styles.imageCardContent}>
              <Text style={styles.imageCardTitle}>图片卡片</Text>
              <Text style={styles.imageCardText}>
                带有图片的卡片设计，适用于产品展示、文章预览等场景。
              </Text>
              <View style={styles.imageCardFooter}>
                <Text style={styles.imageCardDate}>2025-08-13</Text>
                <View style={styles.imageCardActions}>
                  <TouchableOpacity style={styles.iconOnlyButton}>
                    <Ionicons name="heart-outline" size={20} color="#666" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconOnlyButton}>
                    <Ionicons name="share-outline" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.statsCard}>
            <Text style={styles.statsCardTitle}>数据统计</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>1,234</Text>
                <Text style={styles.statLabel}>访问量</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>567</Text>
                <Text style={styles.statLabel}>用户数</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>89</Text>
                <Text style={styles.statLabel}>转化率</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>新增</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 表单控件 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 表单控件</Text>
          <Text style={styles.sectionDescription}>各种输入和控制组件</Text>
          
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>文本输入</Text>
              <TextInput
                style={styles.textInput}
                placeholder="请输入文本..."
                value={inputValue}
                onChangeText={setInputValue}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>多行输入</Text>
              <TextInput
                style={styles.textAreaInput}
                placeholder="请输入多行文本..."
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.controlGroup}>
              <Text style={styles.inputLabel}>开关控制</Text>
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>启用通知</Text>
                <Switch
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                  value={isEnabled}
                  onValueChange={toggleSwitch}
                />
              </View>
            </View>

            <View style={styles.controlGroup}>
              <Text style={styles.inputLabel}>滑动条 (值: {Math.round(sliderValue)})</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={sliderValue}
                onValueChange={setSliderValue}
                minimumTrackTintColor="#34C759"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#34C759"
              />
            </View>

            <View style={styles.controlGroup}>
              <Text style={styles.inputLabel}>选项卡</Text>
              <View style={styles.tabContainer}>
                {['选项1', '选项2', '选项3'].map((tab, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.tabButton,
                      selectedTab === index && styles.activeTabButton
                    ]}
                    onPress={() => setSelectedTab(index)}
                  >
                    <Text style={[
                      styles.tabButtonText,
                      selectedTab === index && styles.activeTabButtonText
                    ]}>
                      {tab}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* 文本样式 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📖 文本样式</Text>
          <Text style={styles.sectionDescription}>各种文本展示效果</Text>
          
          <View style={styles.textDemo}>
            <Text style={styles.headingLarge}>大标题 (24px)</Text>
            <Text style={styles.headingMedium}>中标题 (20px)</Text>
            <Text style={styles.headingSmall}>小标题 (18px)</Text>
            <Text style={styles.bodyLarge}>大正文 (16px) - 这是正文内容的展示</Text>
            <Text style={styles.bodyMedium}>中正文 (14px) - 这是正文内容的展示</Text>
            <Text style={styles.bodySmall}>小正文 (12px) - 这是正文内容的展示</Text>
            <Text style={styles.caption}>说明文字 (10px) - 用于辅助说明</Text>
            
            <View style={styles.textStylesRow}>
              <Text style={styles.boldText}>粗体文本</Text>
              <Text style={styles.italicText}>斜体文本</Text>
              <Text style={styles.underlineText}>下划线文本</Text>
            </View>
            
            <View style={styles.coloredTexts}>
              <Text style={styles.primaryText}>主色文本</Text>
              <Text style={styles.successText}>成功文本</Text>
              <Text style={styles.warningText}>警告文本</Text>
              <Text style={styles.errorText}>错误文本</Text>
              <Text style={styles.mutedText}>静音文本</Text>
            </View>
          </View>
        </View>

        {/* 边框和装饰 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎨 边框和装饰</Text>
          <Text style={styles.sectionDescription}>各种边框、圆角和装饰效果</Text>
          
          <View style={styles.borderDemo}>
            <View style={styles.borderGrid}>
              <View style={styles.roundedBox}>
                <Text style={styles.boxText}>圆角</Text>
              </View>
              <View style={styles.circleBox}>
                <Text style={styles.boxText}>圆形</Text>
              </View>
              <View style={styles.borderBox}>
                <Text style={styles.boxText}>边框</Text>
              </View>
              <View style={styles.dashedBorderBox}>
                <Text style={styles.boxText}>虚线</Text>
              </View>
              <View style={styles.shadowBox}>
                <Text style={styles.boxText}>阴影</Text>
              </View>
              <View style={styles.gradientBox}>
                <Text style={styles.boxText}>渐变</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 动画演示 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ 动画效果</Text>
          <Text style={styles.sectionDescription}>简单的动画交互演示</Text>
          
          <View style={styles.animationDemo}>
            <Animated.View style={[styles.animatedBox, animatedStyle]}>
              <Ionicons name="star" size={30} color="white" />
            </Animated.View>
            <TouchableOpacity style={styles.animationButton} onPress={startAnimation}>
              <Text style={styles.animationButtonText}>播放动画</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 拖拽演示 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 拖拽交互</Text>
          <Text style={styles.sectionDescription}>可拖拽的组件演示</Text>
          
          <View style={styles.dragDemo}>
            <Text style={styles.demoLabel}>拖拽区域 (在下方区域内拖动绿色方块)</Text>
            <View style={styles.dragContainer}>
              <Animated.View
                {...panResponder.panHandlers}
                style={[
                  styles.draggableBox,
                  {
                    transform: [
                      { translateX: dragPosition.x },
                      { translateY: dragPosition.y },
                    ],
                  },
                ]}
              >
                <Ionicons name="move" size={24} color="white" />
                <Text style={styles.draggableText}>拖我</Text>
              </Animated.View>
              
              <View style={styles.dragInstructions}>
                <Text style={styles.instructionText}>💡 提示：触摸并拖动绿色方块</Text>
                <Text style={styles.instructionSubText}>方块会在拖拽结束后自动调整到边界内</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 列表样式 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 列表样式</Text>
          <Text style={styles.sectionDescription}>不同的列表展示方式</Text>
          
          <View style={styles.listDemo}>
            <Text style={styles.demoLabel}>基础列表</Text>
            {['项目一', '项目二', '项目三'].map((item, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.listItemIcon}>
                  <Text style={styles.listItemNumber}>{index + 1}</Text>
                </View>
                <Text style={styles.listItemText}>{item}</Text>
                <Ionicons name="chevron-forward" size={16} color="#ccc" />
              </View>
            ))}
            
            <Text style={styles.demoLabel}>图标列表</Text>
            {[
              { icon: 'home', title: '首页', subtitle: '应用主页面' },
              { icon: 'person', title: '个人中心', subtitle: '用户信息管理' },
              { icon: 'settings', title: '设置', subtitle: '应用配置选项' },
            ].map((item, index) => (
              <TouchableOpacity key={index} style={styles.iconListItem}>
                <View style={styles.iconListLeft}>
                  <View style={styles.iconContainer}>
                    <Ionicons name={item.icon as any} size={20} color="#34C759" />
                  </View>
                  <View style={styles.iconListContent}>
                    <Text style={styles.iconListTitle}>{item.title}</Text>
                    <Text style={styles.iconListSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#ccc" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 徽章和标签 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏷️ 徽章和标签</Text>
          <Text style={styles.sectionDescription}>各种标签和徽章样式</Text>
          
          <View style={styles.badgeDemo}>
            <Text style={styles.demoLabel}>状态徽章</Text>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, styles.successBadge]}>
                <Text style={styles.badgeText}>成功</Text>
              </View>
              <View style={[styles.badge, styles.warningBadge]}>
                <Text style={styles.badgeText}>警告</Text>
              </View>
              <View style={[styles.badge, styles.errorBadge]}>
                <Text style={styles.badgeText}>错误</Text>
              </View>
              <View style={[styles.badge, styles.infoBadge]}>
                <Text style={styles.badgeText}>信息</Text>
              </View>
            </View>
            
            <Text style={styles.demoLabel}>计数徽章</Text>
            <View style={styles.badgeRow}>
              <View style={styles.countBadgeContainer}>
                <Ionicons name="mail" size={24} color="#666" />
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>5</Text>
                </View>
              </View>
              <View style={styles.countBadgeContainer}>
                <Ionicons name="notifications" size={24} color="#666" />
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>99+</Text>
                </View>
              </View>
            </View>
            
            <Text style={styles.demoLabel}>标签组</Text>
            <View style={styles.tagContainer}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>React Native</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Expo</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>移动开发</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>JavaScript</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            React Native 中常用的样式和组件设计
          </Text>
        </View>
      </ScrollView>

      {/* 悬浮按钮组 */}
      <View style={styles.fabContainer}>
        <Animated.View style={[styles.fabSubButton, fabSubButtonStyle(2)]}>
          <TouchableOpacity 
            style={[styles.fabButton, styles.fabSubButtonStyle]}
            onPress={() => {
              showNotificationAlert();
              toggleFab();
            }}
          >
            <Ionicons name="notifications" size={20} color="white" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.fabSubButton, fabSubButtonStyle(1)]}>
          <TouchableOpacity 
            style={[styles.fabButton, styles.fabSubButtonStyle]}
            onPress={() => {
              showModalDialog();
              toggleFab();
            }}
          >
            <Ionicons name="chatbubble" size={20} color="white" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.fabSubButton, fabSubButtonStyle(0)]}>
          <TouchableOpacity 
            style={[styles.fabButton, styles.fabSubButtonStyle]}
            onPress={() => {
              showOverlayMask();
              toggleFab();
            }}
          >
            <Ionicons name="eye" size={20} color="white" />
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity 
          style={[styles.fabButton, styles.fabMainButton]}
          onPress={toggleFab}
        >
          <Animated.View style={{
            transform: [{
              rotate: fabAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '45deg'],
              }),
            }],
          }}>
            <Ionicons name="add" size={24} color="white" />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* 自定义通知 */}
      {showNotification && (
        <Animated.View 
          style={[
            styles.customNotification,
            { transform: [{ translateY: notificationAnimation }] },
          ]}
        >
          <View style={styles.notificationContent}>
            <Ionicons name="checkmark-circle" size={24} color="#28A745" />
            <View style={styles.notificationText}>
              <Text style={styles.notificationTitle}>操作成功</Text>
              <Text style={styles.notificationMessage}>您的操作已成功完成</Text>
            </View>
            <TouchableOpacity 
              onPress={() => {
                notificationAnimation.setValue(-100);
                setShowNotification(false);
              }}
            >
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* 弹窗对话框 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>确认操作</Text>
              <TouchableOpacity 
                onPress={() => setShowModal(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Ionicons name="help-circle" size={48} color="#34C759" style={styles.modalIcon} />
              <Text style={styles.modalMessage}>
                这是一个自定义的弹窗对话框，您可以在这里添加任何内容和交互功能。
              </Text>
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalCancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalConfirmButton}
                onPress={() => {
                  setShowModal(false);
                  showNotificationAlert();
                }}
              >
                <Text style={styles.modalConfirmText}>确认</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 遮罩层 */}
      {showOverlay && (
        <View style={styles.overlayMask}>
          <View style={styles.overlayContent}>
            <View style={styles.loadingSpinner}>
              <Ionicons name="hourglass" size={48} color="white" />
            </View>
            <Text style={styles.overlayText}>加载中...</Text>
            <Text style={styles.overlaySubText}>请稍候，正在处理您的请求</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: '#333',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  demoLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 15,
    color: '#444',
  },

  // 交互功能演示
  interactionDemo: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  notificationButton: {
    backgroundColor: '#17A2B8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  alertButton: {
    backgroundColor: '#FFC107',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  modalButton: {
    backgroundColor: '#6F42C1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  overlayButton: {
    backgroundColor: '#20C997',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  // Flexbox 布局演示
  flexDemo: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  flexRowContainer: {
    flexDirection: 'row',
    height: 80,
    gap: 10,
    marginBottom: 20,
  },
  flexColumnContainer: {
    flexDirection: 'column',
    height: 120,
    gap: 8,
    marginBottom: 20,
  },
  flexItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  flexItemSmall: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  flexItemText: {
    color: 'white',
    fontWeight: '500',
  },
  alignmentDemo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alignmentBox: {
    flex: 1,
    marginHorizontal: 4,
  },
  alignmentLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
    color: '#666',
  },
  alignmentContent: {
    height: 60,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  centerAlignment: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexStartAlignment: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 8,
  },
  flexEndAlignment: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 8,
  },
  dot: {
    width: 12,
    height: 12,
    backgroundColor: '#34C759',
    borderRadius: 6,
  },

  // 按钮样式
  buttonGrid: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#34C759',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  secondaryButton: {
    backgroundColor: '#6C757D',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: '#34C759',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: '#34C759',
    fontSize: 16,
    fontWeight: '500',
  },
  dangerButton: {
    backgroundColor: '#DC3545',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  successButton: {
    backgroundColor: '#28A745',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  successButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  warningButton: {
    backgroundColor: '#FFC107',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  warningButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  iconButton: {
    backgroundColor: '#E91E63',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  iconButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  roundButton: {
    backgroundColor: '#9C27B0',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonSizes: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    gap: 12,
  },
  largeButton: {
    backgroundColor: '#34C759',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 10,
    alignItems: 'center',
  },
  largeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  mediumButton: {
    backgroundColor: '#34C759',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  mediumButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  smallButton: {
    backgroundColor: '#34C759',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  smallButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  // 卡片样式
  basicCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  cardContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDate: {
    fontSize: 12,
    color: '#999',
  },
  cardButton: {
    backgroundColor: '#34C759',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  cardButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  imageCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imagePlaceholder: {
    height: 120,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
  },
  imageCardContent: {
    padding: 16,
  },
  imageCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  imageCardText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
    marginBottom: 12,
  },
  imageCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageCardDate: {
    fontSize: 12,
    color: '#999',
  },
  imageCardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconOnlyButton: {
    padding: 4,
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34C759',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },

  // 表单控件
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  textAreaInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
    height: 80,
    textAlignVertical: 'top',
  },
  controlGroup: {
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabButtonText: {
    color: '#34C759',
    fontWeight: '600',
  },

  // 文本样式
  textDemo: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  headingLarge: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  headingMedium: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  headingSmall: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  bodyLarge: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    marginBottom: 8,
    color: '#333',
    lineHeight: 18,
  },
  caption: {
    fontSize: 10,
    marginBottom: 16,
    color: '#666',
    lineHeight: 14,
  },
  textStylesRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  boldText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  italicText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#333',
  },
  underlineText: {
    fontSize: 14,
    textDecorationLine: 'underline',
    color: '#333',
  },
  coloredTexts: {
    gap: 8,
  },
  primaryText: {
    fontSize: 14,
    color: '#34C759',
  },
  successText: {
    fontSize: 14,
    color: '#28A745',
  },
  warningText: {
    fontSize: 14,
    color: '#FFC107',
  },
  errorText: {
    fontSize: 14,
    color: '#DC3545',
  },
  mutedText: {
    fontSize: 14,
    color: '#6C757D',
  },

  // 边框和装饰
  borderDemo: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  borderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  roundedBox: {
    width: (width - 80) / 3,
    height: 60,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleBox: {
    width: (width - 80) / 3,
    height: 60,
    backgroundColor: '#4ECDC4',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderBox: {
    width: (width - 80) / 3,
    height: 60,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#34C759',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashedBorderBox: {
    width: (width - 80) / 3,
    height: 60,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#9C27B0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowBox: {
    width: (width - 80) / 3,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  gradientBox: {
    width: (width - 80) / 3,
    height: 60,
    backgroundColor: '#667eea',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },

  // 动画
  animationDemo: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  animatedBox: {
    width: 80,
    height: 80,
    backgroundColor: '#FF6B6B',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  animationButton: {
    backgroundColor: '#34C759',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  animationButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  // 列表样式
  listDemo: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  listItemIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listItemNumber: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  iconListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconListLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconListContent: {
    flex: 1,
  },
  iconListTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  iconListSubtitle: {
    fontSize: 12,
    color: '#666',
  },

  // 徽章和标签
  badgeDemo: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  successBadge: {
    backgroundColor: '#28A745',
  },
  warningBadge: {
    backgroundColor: '#FFC107',
  },
  errorBadge: {
    backgroundColor: '#DC3545',
  },
  infoBadge: {
    backgroundColor: '#17A2B8',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  countBadgeContainer: {
    position: 'relative',
    marginRight: 20,
  },
  countBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#DC3545',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  countBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#90caf9',
  },
  tagText: {
    color: '#1976d2',
    fontSize: 12,
    fontWeight: '500',
  },

  // 悬浮按钮
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    alignItems: 'center',
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fabMainButton: {
    backgroundColor: '#34C759',
  },
  fabSubButton: {
    position: 'absolute',
    bottom: 0,
  },
  fabSubButtonStyle: {
    backgroundColor: '#34C759',
    width: 48,
    height: 48,
    borderRadius: 24,
  },

  // 自定义通知
  customNotification: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  notificationContent: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: Platform.OS === 'ios' ? 50 : 20,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  notificationText: {
    flex: 1,
    marginLeft: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
  },

  // 弹窗
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    maxWidth: 320,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: 16,
  },
  modalMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#666',
  },
  modalConfirmText: {
    fontSize: 16,
    color: '#34C759',
    fontWeight: '600',
  },

  overlayMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  overlayContent: {
    alignItems: 'center',
  },
  loadingSpinner: {
    marginBottom: 20,
  },
  overlayText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
    marginBottom: 8,
  },
  overlaySubText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },

  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },

  dragDemo: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  dragContainer: {
    height: 250,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  draggableBox: {
    position: 'absolute',
    width: 80,
    height: 80,
    backgroundColor: '#34C759',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  draggableText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  dragInstructions: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  instructionSubText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
