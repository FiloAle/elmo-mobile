
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface HistoryTripCardProps {
    date: { month: string; day: string };
    city: string;
    distance: string;
    images: string[];
    trackImage: string;
    friends: string[]; // URLs for avatars
}

export default function HistoryTripCard({ date, city, distance, images, trackImage, friends }: HistoryTripCardProps) {
    return (
        <View style={styles.container}>
            {/* Left Column: Date */}
            <View style={styles.dateColumn}>
                <Text style={styles.monthText}>{date.month}</Text>
                <View style={styles.dayCircle}>
                    <Text style={styles.dayText}>{date.day}</Text>
                </View>
                {/* Connection Line */}
                <View style={styles.line} />
            </View>

            {/* Main Content */}
            <View style={styles.contentContainer}>
                <View style={styles.cardsRow}>
                    {/* Map Snippet */}
                    <View style={[styles.cardBox, styles.mapBox]}>
                        <Image source={{ uri: trackImage }} style={styles.imageFill} contentFit="cover" />
                        {/* Overlay for GPS track (visual effect if needed) */}
                        <View style={styles.overlay} />
                    </View>

                    {/* Photo Gallery Preview */}
                    <View style={[styles.cardBox, styles.photoBox]}>
                        <Image source={{ uri: images[0] }} style={styles.imageFill} contentFit="cover" />
                        {images.length > 1 && (
                            <View style={styles.photoOverlay}>
                                <Text style={styles.photoCountText}>+{32}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Footer Row */}
                <View style={styles.footerRow}>
                    <View style={styles.locationContainer}>
                        <Ionicons name="location-sharp" size={16} color={Colors.elmo.accent} />
                        <Text style={styles.cityText}>{city}</Text>
                        <Text style={styles.distanceText}>{distance}</Text>
                    </View>

                    {/* Friend Avatars */}
                    <View style={styles.avatarsContainer}>
                        {friends.slice(0, 3).map((friend, index) => (
                            <View key={index} style={[styles.avatarCircle, { zIndex: 3 - index, marginLeft: index === 0 ? 0 : -10 }]}>
                                {/* Placeholder coloring or image */}
                                <Image source={{ uri: friend }} style={styles.avatarImage} />
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    dateColumn: {
        alignItems: 'center',
        marginRight: 15,
        width: 40,
    },
    monthText: {
        color: Colors.elmo.textSecondary,
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    dayCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 0,
    },
    dayText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14,
    },
    line: {
        width: 1,
        flex: 1,
        backgroundColor: Colors.elmo.textSecondary,
        opacity: 0.3,
        marginTop: 8,
    },
    contentContainer: {
        flex: 1,
    },
    cardsRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    cardBox: {
        flex: 1,
        height: 150,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: Colors.elmo.cardDark,
    },
    mapBox: {},
    photoBox: {},
    imageFill: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    photoOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoCountText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    cityText: {
        color: Colors.elmo.text,
        fontSize: 16,
        fontWeight: '600',
    },
    distanceText: {
        color: Colors.elmo.textSecondary,
        fontSize: 14,
    },
    avatarsContainer: {
        flexDirection: 'row',
    },
    avatarCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: Colors.elmo.background,
        overflow: 'hidden',
        backgroundColor: '#ccc',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    }
});
