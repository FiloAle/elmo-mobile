import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Dimensions, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
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

// Mock Data for Bills
const BILLS_DATA = [
    { id: '1', category: 'Breakfast', participants: 3, price: '15€' },
    { id: '2', category: 'Fuel', participants: 4, price: '45€' },
    { id: '3', category: 'Tickets', participants: 4, price: '80€' },
    { id: '4', category: 'Lunch', participants: 4, price: '60€' },
    { id: '6', category: 'Parking', participants: 1, price: '5€' },
];

const ALBUM_DATA = [
    { id: '1', uri: 'https://picsum.photos/id/10/400/400' },
    { id: '2', uri: 'https://picsum.photos/id/11/400/400' },
    { id: '3', uri: 'https://picsum.photos/id/12/400/400' },
    { id: '4', uri: 'https://picsum.photos/id/13/400/400' },
    { id: '5', uri: 'https://picsum.photos/id/14/400/400' },
    { id: '6', uri: 'https://picsum.photos/id/15/400/400' },
];

const MUSIC_DATA = [
    { id: '1', title: 'Midnight City', artist: 'M83', addedBy: 'Ale', cover: 'https://picsum.photos/id/50/200/200' },
    { id: '2', title: 'Instant Crush', artist: 'Daft Punk', addedBy: 'Vale', cover: 'https://picsum.photos/id/51/200/200' },
    { id: '3', title: 'Fluorescent Adolescent', artist: 'Arctic Monkeys', addedBy: 'Ste', cover: 'https://picsum.photos/id/52/200/200' },
    { id: '4', title: 'Kids', artist: 'MGMT', addedBy: 'Ale', cover: 'https://picsum.photos/id/53/200/200' },
    { id: '5', title: 'Breezeblocks', artist: 'alt-J', addedBy: 'Vale', cover: 'https://picsum.photos/id/54/200/200' },
];

export default function TripDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { city, status, date, distance, image, friends } = params;
    const [activeTab, setActiveTab] = useState('Trip');
    const [sheetIndex, setSheetIndex] = useState(1);

    const friendsList = useMemo(() => {
        try {
            return typeof friends === 'string' ? JSON.parse(friends) : [];
        } catch (e) {
            return [];
        }
    }, [friends]);

    // Calculate snap points dynamically to stop strictly below header buttons
    // Buttons bottom: iOS ~104 (60+44), Android ~84 (40+44). 
    // We want a top margin of approx 100px.
    // Using topInset approach indirectly by setting the max snap point.
    const HEADER_HEIGHT = 110;
    const topSnapPoint = height - HEADER_HEIGHT;
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

    const renderBillItem = (item: typeof BILLS_DATA[0], index: number) => (
        <View key={item.id} style={styles.billCard}>
            <View style={styles.billLeft}>
                <View style={styles.billAvatar} />
                <View>
                    <Text style={styles.billCategory}>{item.category}</Text>
                    <Text style={styles.billParticipants}>{item.participants} participants</Text>
                </View>
            </View>
            <Text style={styles.billPrice}>{item.price}</Text>
        </View>
    );

    const TripContent = () => (
        <>
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
                        {friendsList.length > 0 ? (
                            friendsList.slice(0, 4).map((friend: string, index: number) => (
                                <View key={index} style={[styles.avatarCircle, { zIndex: 4 - index, marginLeft: index === 0 ? 0 : -8 }]}>
                                    <Image source={{ uri: friend }} style={styles.avatarImage} />
                                </View>
                            ))
                        ) : (
                            [1, 2, 3].map((_, i) => (
                                <View key={i} style={[styles.avatarPlaceholder, { marginLeft: i > 0 ? -10 : 0 }]} />
                            ))
                        )}
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
        </>
    );

    const CostContent = () => (
        <>
            {/* Summary Row */}
            <TouchableOpacity style={styles.costSummaryContainer} activeOpacity={0.7}>
                <View style={styles.costSummaryLeft}>
                    <View style={styles.walletIconContainer}>
                        <Ionicons name="wallet-outline" size={20} color="#FFF" />
                    </View>
                    <View>
                        <Text style={styles.costValue}>35.7€</Text>
                        <Text style={styles.costLabel}>Cost for the Trip</Text>
                    </View>
                </View>

                <View style={styles.costSummaryRight}>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.costValue}>42.3€</Text>
                        <Text style={styles.costLabel}>You Should Receive</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#71717A" style={{ marginLeft: 8 }} />
                </View>
            </TouchableOpacity>

            <View style={[styles.sectionHeader, { marginTop: 24 }]}>
                <Text style={styles.sectionTitle}>Bill</Text>
                <TouchableOpacity style={styles.editBadge}>
                    <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.billsList}>
                {BILLS_DATA.map((item, index) => renderBillItem(item, index))}
            </View>
        </>
    );

    const AlbumContent = () => {
        const screenWidth = Dimensions.get('window').width;
        // Total horizontal padding: 24 (left) + 24 (right) = 48
        // Gap between items: 10 * 2 = 20 (for 3 items there are 2 gaps)
        // Item width = (screenWidth - 48 - 20) / 3
        const gap = 10;
        const padding = 24;
        const itemWidth = (screenWidth - (padding * 2) - (gap * 2)) / 3;

        return (
            <View style={styles.albumGrid}>
                {ALBUM_DATA.length === 0 ? (
                    <View style={{ width: '100%', alignItems: 'center', marginTop: 40 }}>
                        <Text style={{ color: '#A1A1AA', fontSize: 16 }}>No photos yet. Start capturing your trip!</Text>
                    </View>
                ) : (
                    ALBUM_DATA.map((item) => (
                        <Image
                            key={item.id}
                            source={{ uri: item.uri }}
                            style={[styles.albumImage, { width: itemWidth, height: itemWidth }]}
                            contentFit="cover"
                        />
                    ))
                )}
            </View>
        );
    };

    const MusicContent = () => {
        // Now Playing Data (Mock)
        const currentSong = {
            title: "Heroes",
            artist: "David Bowie",
            cover: "https://picsum.photos/id/88/300/300"
        };

        return (
            <>
                {/* Now Playing Card */}
                <View style={styles.nowPlayingCard}>
                    <Image source={{ uri: currentSong.cover }} style={styles.nowPlayingCover} contentFit="cover" />
                    <View style={styles.nowPlayingInfo}>
                        <Text style={styles.nowPlayingTitle} numberOfLines={1}>{currentSong.title}</Text>
                        <Text style={styles.nowPlayingArtist} numberOfLines={1}>{currentSong.artist}</Text>
                    </View>
                    <View style={styles.nowPlayingControls}>
                        <TouchableOpacity style={{ marginRight: 16 }}>
                            <Ionicons name="heart-outline" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.playButton}>
                            <Ionicons name="pause" size={20} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[styles.sectionHeader, { marginTop: 32 }]}>
                    <Text style={styles.sectionTitle}>Up Next</Text>
                </View>

                {/* Playlist */}
                <View style={styles.playlistContainer}>
                    {MUSIC_DATA.map((item, index) => (
                        <View key={item.id} style={styles.playlistItem}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <Image source={{ uri: item.cover }} style={styles.playlistCover} contentFit="cover" />
                                <View style={{ marginLeft: 12, flex: 1 }}>
                                    <Text style={styles.playlistTitle} numberOfLines={1}>{item.title}</Text>
                                    <Text style={styles.playlistArtist} numberOfLines={1}>{item.artist}</Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                {/* User who added the song */}
                                <View style={styles.addedByAvatar}>
                                    <Text style={styles.avatarInitials}>{item.addedBy[0]}</Text>
                                </View>
                                <MaterialCommunityIcons name="drag-horizontal" size={24} color="#555" />
                            </View>
                        </View>
                    ))}
                </View>
            </>
        );
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />

                {/* 1. Background Image/Map */}
                <View style={styles.fixedBackground}>
                    <Image
                        source={require('../assets/images/background map.jpg')}
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
                    index={sheetIndex} // Controlled index
                    onChange={(index) => setSheetIndex(index)} // Sync state with interactions
                    handleIndicatorStyle={{ backgroundColor: '#555', width: 40 }}
                    backgroundStyle={{ backgroundColor: '#051616', borderTopLeftRadius: 30, borderTopRightRadius: 30 }}
                    topInset={110}
                >
                    <View style={{ flex: 1 }}>
                        {/* Sticky Tab Bar Container */}
                        <View style={{
                            backgroundColor: '#051616',
                            paddingHorizontal: 24,
                            paddingBottom: 16,
                            paddingTop: 16,
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30
                        }}>
                            {/* Navigation Pills */}
                            <View style={styles.pillTabsContainer}>
                                {['Trip', 'Cost', 'Album', 'Music'].map((tab) => (
                                    <TouchableOpacity
                                        key={tab}
                                        style={[styles.pillTab, activeTab === tab && styles.activePillTab]}
                                        onPress={() => setActiveTab(tab)}
                                    >
                                        <Text style={[styles.pillText, activeTab === tab && styles.activePillText]}>
                                            {tab}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <BottomSheetScrollView
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            {activeTab === 'Trip' ? <TripContent /> : activeTab === 'Cost' ? <CostContent /> : activeTab === 'Album' ? <AlbumContent /> : activeTab === 'Music' ? <MusicContent /> : null}

                            {/* Padding for bottom safety */}
                            <View style={{ height: 100 }} />
                        </BottomSheetScrollView>
                    </View>
                </BottomSheet>
            </View>

            {/* Footer Button - Fixed at bottom of Screen */}
            <View style={styles.fixedFooter}>
                {activeTab === 'Trip' ? (
                    <TouchableOpacity
                        style={styles.addStopButton}
                        activeOpacity={0.8}
                        onPress={() => router.push('/add-stop')}
                    >
                        <Text style={styles.addStopButtonText}>+ Add Stop</Text>
                    </TouchableOpacity>
                ) : activeTab === 'Cost' ? (
                    <TouchableOpacity
                        style={styles.addBillButton}
                        activeOpacity={0.8}
                        onPress={() => { }} // TODO: Add Bill action
                    >
                        <Text style={styles.addBillButtonText}>+ Add Bill</Text>
                    </TouchableOpacity>
                ) : activeTab === 'Album' ? (
                    <TouchableOpacity
                        style={styles.addBillButton}
                        activeOpacity={0.8}
                        onPress={() => { }} // TODO: Add Photo action
                    >
                        <Text style={styles.addBillButtonText}>+ Add Photo</Text>
                    </TouchableOpacity>
                ) : activeTab === 'Music' ? (
                    <TouchableOpacity
                        style={styles.addBillButton}
                        activeOpacity={0.8}
                        onPress={() => { }} // TODO: Add Music action
                    >
                        <Text style={styles.addBillButtonText}>+ Add Music</Text>
                    </TouchableOpacity>
                ) : null}
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
        paddingHorizontal: 24,
        paddingBottom: 24,
        paddingTop: 8,
    },
    pillTabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#0F2929',
        borderRadius: 30,
        padding: 4,
        marginBottom: 0, // Removed bottom margin as padding is handled by parent/scrollview
    },
    pillTab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    activePillTab: {
        // User requested grey/white for cost, assuming for all active tabs
        backgroundColor: Colors.elmo.accent,
    },
    activePillText: {
        color: '#000',
        fontWeight: '600',
    },
    pillText: {
        color: '#B7B7B7',
        fontSize: 14,
        fontWeight: '400',
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
    avatarCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#051616',
        overflow: 'hidden',
        backgroundColor: '#ccc',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
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
    addBillButton: {
        height: 48,
        backgroundColor: '#2DD4BF', // Mint Green
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    addBillButtonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'regular',
    },
    // Cost View Styles
    costSummaryContainer: {
        backgroundColor: '#0F0F10', // Dark Grey (Zinc-900 like)
        borderRadius: 48,
        padding: 16,
        marginBottom: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    costSummaryLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    costSummaryRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    walletIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 32,
        backgroundColor: '#27272A', // Zinc-800
        alignItems: 'center',
        justifyContent: 'center',
    },
    costValue: {
        color: Colors.elmo.accent,
        fontSize: 18,
        fontWeight: '600',
    },
    costLabel: {
        color: '#A1A1AA', // Zinc-400
        fontSize: 12,
    },
    billsList: {
        gap: 12,
    },
    billCard: {
        backgroundColor: '#0F0F10', // Very dark essentially black/grey
        borderRadius: 32,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    billLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    billAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#3F3F46', // Avatar placeholder color
    },
    billCategory: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '500',
    },
    billParticipants: {
        color: '#71717A',
        fontSize: 12,
    },
    billPrice: {
        color: '#2DD4BF', // Mint
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    // Album Grid Styles
    albumGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    albumImage: {
        borderRadius: 12,
        backgroundColor: '#333',
    },
    // Music View Styles
    nowPlayingCard: {
        backgroundColor: '#0F2929', // Darker Teal
        borderRadius: 32,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    nowPlayingCover: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: '#333',
    },
    nowPlayingInfo: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    nowPlayingTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    nowPlayingArtist: {
        color: '#A1A1AA',
        fontSize: 14,
    },
    nowPlayingControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    playButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.elmo.accent,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playlistContainer: {
        gap: 12,
    },
    playlistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    playlistCover: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#333',
    },
    playlistTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '500',
    },
    playlistArtist: {
        color: '#71717A',
        fontSize: 12,
        marginTop: 2,
    },
    addedByAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#555',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#000',
    },
    avatarInitials: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
