import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface HistoryTripCardProps {
    date: { month: string; day: string };
    city: string;
    distance: string;
    images: string[];
    trackImage: string | number;
    friends: string[];
}

// Removed showDate and isFirst props as date handling is moved to parent
export default function HistoryTripCard({ city, distance, images, trackImage, friends }: HistoryTripCardProps) {
    const trackImageSource = typeof trackImage === 'string' ? { uri: trackImage } : trackImage;

    return (
        <View style={styles.container}>
            {/* Main Content */}
            <View style={styles.contentContainer}>
                <View style={styles.cardsRow}>
                    {/* Map Snippet */}
                    <View style={[styles.cardBox, styles.mapBox]}>
                        <Image source={trackImageSource} style={styles.imageFill} contentFit="cover" />
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
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    // Removed dateHeader style
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
