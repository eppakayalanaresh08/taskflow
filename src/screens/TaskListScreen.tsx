import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTaskStore, filterAndSortTasks } from '../store/taskStore';
import { Task } from '../types/task';
import { colors, borderRadius, spacing, shadows } from '../theme';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { FilterTabs } from '../components/FilterTabs';
import { TaskCard } from '../components/TaskCard';
import { OfflineBanner } from '../components/OfflineBanner';
import { SortModal } from '../components/SortModal';
import { BottomTabBar } from '../components/BottomTabBar';
import { Icon } from '../components/Icon';

export const TaskListScreen: React.FC = () => {
  // Redux Toolkit store state
  const tasks = useTaskStore(state => state.tasks);
  const isLoading = useTaskStore(state => state.isLoading);
  const isRefreshing = useTaskStore(state => state.isRefreshing);
  const isLoadingMore = useTaskStore(state => state.isLoadingMore);
  const isOffline = useTaskStore(state => state.isOffline);
  const error = useTaskStore(state => state.error);
  const searchQuery = useTaskStore(state => state.searchQuery);
  const statusFilter = useTaskStore(state => state.statusFilter);
  const categoryFilter = useTaskStore(state => state.categoryFilter);
  const sortBy = useTaskStore(state => state.sortBy);
  const isSortModalOpen = useTaskStore(state => state.isSortModalOpen);
  const isAIModalOpen = useTaskStore(state => state.isAIModalOpen);
  const activeBottomTab = useTaskStore(state => state.activeBottomTab);

  // Redux Toolkit actions
  const fetchMoreTasks = useTaskStore(state => state.fetchMoreTasks);
  const refreshTasks = useTaskStore(state => state.refreshTasks);
  const toggleTaskStatus = useTaskStore(state => state.toggleTaskStatus);
  const setSearchQuery = useTaskStore(state => state.setSearchQuery);
  const setStatusFilter = useTaskStore(state => state.setStatusFilter);
  const setCategoryFilter = useTaskStore(state => state.setCategoryFilter);
  const setSortBy = useTaskStore(state => state.setSortBy);
  const setSortModalOpen = useTaskStore(state => state.setSortModalOpen);
  const setAIModalOpen = useTaskStore(state => state.setAIModalOpen);
  const setActiveBottomTab = useTaskStore(state => state.setActiveBottomTab);
  const openTaskDetail = useTaskStore(state => state.openTaskDetail);
  const openCreateTask = useTaskStore(state => state.openCreateTask);

  // Compute status counts for badges
  const statusCounts = useMemo(() => {
    let base = tasks;
    if (categoryFilter !== 'all') {
      base = base.filter(
        t => t.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    const completed = base.filter(t => t.completed).length;
    return {
      all: base.length,
      pending: base.length - completed,
      completed,
    };
  }, [tasks, categoryFilter]);

  // Compute filtered & sorted tasks
  const filteredTasks = useMemo(() => {
    return filterAndSortTasks(
      tasks,
      searchQuery,
      statusFilter,
      categoryFilter,
      sortBy
    );
  }, [tasks, searchQuery, statusFilter, categoryFilter, sortBy]);

  // Handle task press: navigate to details
  const handleTaskPress = useCallback(
    (taskId: string | number) => {
      openTaskDetail(taskId);
    },
    [openTaskDetail]
  );

  // Handle task status checkbox toggle
  const handleToggleStatus = useCallback(
    (taskId: string | number) => {
      toggleTaskStatus(taskId);
    },
    [toggleTaskStatus]
  );

  // Stable keyExtractor
  const keyExtractor = useCallback(
    (item: Task) => String(item.id),
    []
  );

  // Render Section Header when in normal list mode
  const renderItem = useCallback(
    ({ item, index }: { item: Task; index: number }) => {
      // Check if this item is the start of a section
      const prevItem = index > 0 ? filteredTasks[index - 1] : null;
      const isNewSection = !prevItem || prevItem.section !== item.section;
      const showSectionHeader =
        !searchQuery &&
        statusFilter === 'all' &&
        sortBy === 'dueDate' &&
        item.section &&
        isNewSection;

      // Count tasks in this section
      const sectionCount = showSectionHeader
        ? filteredTasks.filter(t => t.section === item.section).length
        : 0;

      return (
        <View>
          {showSectionHeader && (
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>{item.section}</Text>
              <View style={styles.sectionCountPill}>
                <Text style={styles.sectionCountText}>{sectionCount}</Text>
              </View>
            </View>
          )}
          <TaskCard
            task={item}
            onPress={handleTaskPress}
            onToggleStatus={handleToggleStatus}
          />
        </View>
      );
    },
    [filteredTasks, searchQuery, statusFilter, sortBy, handleTaskPress, handleToggleStatus]
  );

  // Empty state renderer
  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.emptyLoadingText}>Loading tasks from TaskFlow...</Text>
        </View>
      );
    }

    if (error && tasks.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>⚠️</Text>
          <Text style={styles.emptyTitle}>Unable to connect</Text>
          <Text style={styles.emptySubtitle}>{error}</Text>
          <TouchableOpacity
            style={styles.emptyActionBtn}
            onPress={refreshTasks}
          >
            <Text style={styles.emptyActionBtnText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📝</Text>
        <Text style={styles.emptyTitle}>No tasks found</Text>
        <Text style={styles.emptySubtitle}>
          {searchQuery
            ? `No tasks matching "${searchQuery}"`
            : statusFilter !== 'all'
            ? `No ${statusFilter} tasks in this view`
            : 'Create your first task using the button below'}
        </Text>
        {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all') && (
          <TouchableOpacity
            style={styles.emptyActionBtn}
            onPress={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setCategoryFilter('all');
            }}
          >
            <Text style={styles.emptyActionBtnText}>Reset Filters</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Footer loader for infinite scroll pagination
  const renderFooter = () => {
    if (!isLoadingMore) return <View style={styles.footerSpacing} />;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#3B82F6" />
        <Text style={styles.footerLoaderText}>Loading more tasks...</Text>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      {/* Top Header with Dynamic Island & Sort */}
      <Header
        title="Tasks"
        onPressSort={() => setSortModalOpen(true)}
      />

      {/* Offline Status Banner */}
      <OfflineBanner
        isOffline={isOffline}
        onRetry={refreshTasks}
      />

      {/* Search Input Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={() => setSearchQuery('')}
      />

      {/* Category & Status Filter Tabs */}
      <FilterTabs
        selectedCategory={categoryFilter}
        onSelectCategory={setCategoryFilter}
        selectedStatus={statusFilter}
        onSelectStatus={setStatusFilter}
        statusCounts={statusCounts}
      />

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshTasks}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
        onEndReached={fetchMoreTasks}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        // Performance optimizations to avoid unnecessary re-renders
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
      />

      {/* Floating Action Button with AI Sparkle & Quick Add */}
      <View style={styles.fabContainer}>
        {/* Quick Add Task Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={openCreateTask}
          style={styles.quickAddFab}
          accessibilityLabel="Create new task"
        >
          <Icon name="plus" size={20} color="#2563EB" />
        </TouchableOpacity>

        {/* AI Assistant Sparkle Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setAIModalOpen(true)}
          style={styles.aiSparkleFab}
          accessibilityLabel="AI Smart Task Breakdown"
        >
          <Icon name="sparkle" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Bottom 5-Tab Navigation Dock */}
      <BottomTabBar
        activeTab={activeBottomTab}
        onSelectTab={setActiveBottomTab}
      />

      {/* Sort Options Modal */}
      <SortModal
        visible={isSortModalOpen}
        currentSort={sortBy}
        onSelectSort={setSortBy}
        onClose={() => setSortModalOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EEF4FA',
  },
  listContent: {
    paddingTop: 4,
    paddingBottom: 90,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#64748B',
    textTransform: 'uppercase',
  },
  sectionCountPill: {
    backgroundColor: '#E2EDF9',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.pill,
    marginLeft: 6,
  },
  sectionCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  emptyContainer: {
    paddingVertical: 48,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 44,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  emptyLoadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },
  emptyActionBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: borderRadius.pill,
  },
  emptyActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  footerLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  footerLoaderText: {
    fontSize: 12,
    color: '#64748B',
  },
  footerSpacing: {
    height: 20,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 74,
    right: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quickAddFab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
  },
  aiSparkleFab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
  },
});

