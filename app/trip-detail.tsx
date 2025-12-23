import React, { useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Colors } from '@/constants/theme';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { height } = Dimensions.get('window');

// Mock Data for Timeline
const TIMELINE_DATA = [
    { id: '1', title: "Home", time: "Depart at 10:00", status: 'completed' },
    { id: '2', title: "Vale's House", time: "10:30", distance: "12km", status: 'completed' },
    { id: '3', title: "Ale's House", time: "11:15", status: 'current', progress: 0.6 },
    { id: '4', title: "Lunch Break", time: "13:00", status: 'upcoming' },
    { id: '5', title: "Como", time: "15:00", status: 'upcoming', isDestination: true },
];

export default function TripDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { city, status, date, distance, image } = params;

    // Calculate snap points dynamically to stop strictly below header buttons
    // Buttons bottom: iOS ~104 (60+44), Android ~84 (40+44). 
    // We add a small margin (e.g. 6-10px) to sit just under.
    const topOffset = Platform.OS === 'ios' ? 110 : 90;
    const topSnapPoint = height - topOffset;
    const snapPoints = useMemo(() => ['25%', '70%', topSnapPoint], [topSnapPoint]);

    const renderTimelineItem = (item: typeof TIMELINE_DATA[0], index: number) => {
        const isLast = index === TIMELINE_DATA.length - 1;
        const isCompleted = item.status === 'completed';
        const isCurrent = item.status === 'current';
        const nextItem = TIMELINE_DATA[index + 1];
        const showSolidLine = isCompleted && (nextItem?.status === 'completed' || nextItem?.status === 'current');
        const showActiveSegment = isCompleted && nextItem?.status === 'current';

        return (
            <View key={item.id} style={styles.timelineItemWrapper}>
                <View style={styles.connectorColumn}>
                    <View style={[
                        styles.nodeCircle,
                        (isCompleted || isCurrent) && styles.nodeFilled,
                        (!isCompleted && !isCurrent) && styles.nodeOutline,
                        item.isDestination && styles.nodePin
                    ]}>
                        {item.isDestination && <Ionicons name="location-sharp" size={14} color="#000" />}
                    </View>
                    {!isLast && (
                        <View style={[
                            styles.connectorLine,
                            showSolidLine ? styles.solidLine : styles.dashedLine
                        ]} />
                    )}
                </View>

                <View style={[styles.contentColumn, showActiveSegment && styles.activeBoxWrapper]}>
                    <View style={styles.rowInfo}>
                        <Text style={styles.stopNameText}>{item.title}</Text>
                        <View style={styles.rightInfo}>
                            {item.distance && <Text style={styles.timeInfoText}>{item.distance}</Text>}
                            <Text style={styles.timeInfoText}>{item.time}</Text>
                        </View>
                    </View>

                    {showActiveSegment && (
                        <View style={styles.progressContainer}>
                            <View style={styles.progressBarBg}>
                                <View style={[styles.progressBarFill, { width: `${(nextItem.progress || 0.5) * 100}%` }]} />
                            </View>
                            <View style={[styles.progressArrow, { left: `${(nextItem.progress || 0.5) * 100}%` }]}>
                                <MaterialCommunityIcons name="car-side" size={40} color={Colors.elmo.accent} />
                            </View>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />

                {/* 1. Background Image/Map */}
                <View style={styles.fixedBackground}>
                    <Image
                        source={typeof image === 'string' ? { uri: image } : require('../assets/images/monte bianco.jpg')}
                        style={styles.image}
                        contentFit="cover"
                    />
                    <View style={styles.overlay} />
                </View>

                {/* 2. Header Buttons (Fixed Floating) */}
                <View style={styles.headerButtonsContainer}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="share-outline" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* 3. Bottom Sheet Curtain */}
                <BottomSheet
                    snapPoints={snapPoints}
                    index={1} // Start at 70%
                    handleIndicatorStyle={{ backgroundColor: '#555', width: 40 }}
                    backgroundStyle={{ backgroundColor: '#051616', borderTopLeftRadius: 30, borderTopRightRadius: 30 }}
                    enableContentPanningGesture={false} // Only allow dragging via the handle/header
                    enableOverDrag={false} // Prevent dragging beyond the top snap point
                >
                    <View style={{ flex: 1 }}>
                        <BottomSheetScrollView
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            {/* Navigation Pills */}
                            <View style={styles.pillTabsContainer}>
                                {['Trip', 'Cost', 'Album', 'Music'].map((tab) => (
                                    <TouchableOpacity
                                        key={tab}
                                        style={[styles.pillTab, tab === 'Trip' && styles.activePillTab]}
                                    >
                                        <Text style={[styles.pillText, tab === 'Trip' && styles.activePillText]}>
                                            {tab}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Trip Overview</Text>
                                <View style={styles.statusBadge}>
                                    <Text style={styles.statusText}>{status || 'On Going'}</Text>
                                </View>
                            </View>

                            {/* Trip Overview Section */}
                            <View style={styles.overviewSection}>
                                <Image
                                    source={typeof image === 'string' ? { uri: image } : require('../assets/images/monte bianco.jpg')}
                                    style={styles.destImage}
                                    contentFit="cover"
                                />
                                <View style={styles.overviewInfo}>
                                    <View style={styles.titleRow}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                            <Ionicons name="location-outline" size={24} color={Colors.elmo.accent} />
                                            <Text style={styles.cityText}>{city || 'Como'}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.avatarRow}>
                                        {[1, 2, 3].map((_, i) => (
                                            <View key={i} style={[styles.avatarPlaceholder, { marginLeft: i > 0 ? -10 : 0 }]} />
                                        ))}
                                    </View>
                                    <View style={styles.statsRow}>
                                        <Text style={styles.statText}>{date || '03, Dec'}</Text>
                                        <View style={styles.statDot} />
                                        <Text style={styles.statText}>10:30</Text>
                                        <View style={styles.statDot} />
                                        <Text style={styles.statText}>{distance || '113.8km'}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.separator} />

                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Trip Details</Text>
                                <TouchableOpacity style={styles.editBadge}>
                                    <Text style={styles.editText}>Edit</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Timeline Section */}
                            <View style={styles.timelineSection}>
                                {TIMELINE_DATA.map((item, index) => renderTimelineItem(item, index))}
                            </View>

                            {/* Padding for bottom safety */}
                            <View style={{ height: 100 }} />
                        </BottomSheetScrollView>
                    </View>
                </BottomSheet>
            </View>

            {/* Footer Button - Fixed at bottom of Screen */}
            <View style={styles.fixedFooter}>
                <TouchableOpacity
                    style={styles.addStopButton}
                    activeOpacity={0.8}
                    onPress={() => router.push('/add-stop')}
                >
                    <Text style={styles.addStopButtonText}>+ Add Stop</Text>
                </TouchableOpacity>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    fixedBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    headerButtonsContainer: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 40,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 20,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#27272A',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    scrollContent: {
        padding: 24,
    },
    pillTabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#0F2929',
        borderRadius: 30,
        padding: 4,
        marginBottom: 24,
    },
    pillTab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    activePillTab: {
        backgroundColor: Colors.elmo.accent,
    },
    pillText: {
        color: '#B7B7B7',
        fontSize: 14,
        fontWeight: '400',
    },
    activePillText: {
        color: '#000',
    },
    overviewSection: {
        flexDirection: 'row',
        marginBottom: 24,
        alignItems: 'center',
    },
    destImage: {
        width: 100,
        height: 100,
        borderRadius: 16,
        marginRight: 16,
    },
    overviewInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    cityText: {
        color: '#2DD4BF',
        fontSize: 27,
        fontWeight: 'regular',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        width: '100%',
    },
    sectionTitle: {
        flex: 1, // Pushes the badge/button to the far right
        color: '#B7B7B7',
        fontSize: 16,
        fontWeight: 'regular',
    },
    statusBadge: {
        backgroundColor: 'rgba(45, 212, 191, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: Colors.elmo.accent,
        fontSize: 12,
        fontWeight: '400',
        textTransform: 'uppercase',
    },
    avatarRow: {
        flexDirection: 'row',
        marginBottom: 10,
        paddingLeft: 4,
    },
    avatarPlaceholder: {
        width: 32,
        height: 32,
        borderRadius: 24,
        backgroundColor: '#555',
        borderWidth: 1,
        borderColor: '#051616',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '300',
    },
    statDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#444',
    },
    separator: {
        height: 1,
        backgroundColor: '#FFFFFF10',
        marginVertical: 10,
    },
    timelineSection: {
        marginTop: 10,
    },
    timelineItemWrapper: {
        flexDirection: 'row',
        marginBottom: 8,
        minHeight: 60,
    },
    connectorColumn: {
        width: 30,
        alignItems: 'center',
        marginRight: 10,
        justifyContent: 'flex-start',
        paddingTop: 3,
    },
    nodeCircle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        zIndex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nodeFilled: {
        backgroundColor: Colors.elmo.accent,
    },
    nodeOutline: {
        borderWidth: 2,
        borderColor: '#555',
        backgroundColor: '#051616',
    },
    nodePin: {
        backgroundColor: '#FFF',
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    connectorLine: {
        width: 2,
        flex: 1,
        marginTop: -2,
        marginBottom: -2,
    },
    solidLine: {
        backgroundColor: Colors.elmo.accent,
    },
    dashedLine: {
        borderWidth: 1,
        borderColor: '#555',
        borderStyle: 'dashed',
        backgroundColor: 'transparent',
    },
    contentColumn: {
        flex: 1,
        paddingBottom: 20,
    },
    activeBoxWrapper: {
        backgroundColor: '#0A1F1F',
        borderColor: Colors.elmo.accent,
        borderWidth: 1,
        borderRadius: 24,
        padding: 16,
        marginTop: 0,
        marginBottom: 20,
        marginLeft: -10,
        shadowColor: Colors.elmo.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 2,
    },
    rowInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    stopNameText: {
        color: '#FFF',
        fontSize: 21,
        fontWeight: '300',
    },
    rightInfo: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 12,
    },
    timeInfoText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '300',
    },
    progressContainer: {
        marginTop: 12,
        height: 20,
        justifyContent: 'center',
    },
    progressBarBg: {
        height: 4,
        backgroundColor: '#333',
        borderRadius: 2,
        width: '100%',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.elmo.accent,
        borderRadius: 2,
    },
    progressArrow: {
        position: 'absolute',
        top: -18,
        marginLeft: -40,
    },
    editBadge: {
        backgroundColor: '#27272A',
        borderRadius: 24,
        paddingHorizontal: 24,
        paddingVertical: 6,
    },
    editText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '300',
    },
    fixedFooter: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        zIndex: 100,
    },
    addStopButton: {
        height: 48,
        backgroundColor: Colors.elmo.accent, // Mint Green
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    addStopButtonText: {
        color: '#051616',
        fontSize: 18,
        fontWeight: 'regular',
    },
});
