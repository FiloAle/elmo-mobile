import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface UpcomingTripCardProps {
    date: { month: string; day: string };
    city: string;
    daysLeft: number;
    time: string;
    distance: string;
    image: string | number;
    friends: string[];
    highlighted?: boolean;
}

import { useRouter } from 'expo-router';
// ... existing imports

export default function UpcomingTripCard({ date, city, daysLeft, time, distance, image, friends, highlighted }: UpcomingTripCardProps) {
    const router = useRouter();

    const handlePress = () => {
        // Only navigate if it's the Monte Bianco trip (or generic if desired, prompt said "Locate the UpcomingTripCard that displays 'Monte Bianco' trip")
        // But making it generic is better UX.
        router.push({
            pathname: '/trip-detail',
            params: {
                city,
                status: 'On Going',
                date: `${date.day}, ${date.month}`,
                distance,
                // Passing image source is tricky via params if it's a 'require' number.
                // We'll skip passing 'image' if it's a number, so the detail screen uses its default fallback or specific logic.
                image: typeof image === 'string' ? image : undefined,
                friends: JSON.stringify(friends) // Serialize array
            }
        });
    };

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.9}
            onPress={handlePress}
        >
            {/* Main Card Container */}
            <View style={styles.card}>

                {/* Top Section: Full Width Image */}
                <View style={styles.imageContainer}>
                    <Image source={typeof image === 'string' ? { uri: image } : image} style={styles.image} contentFit="cover" />

                    {/* Image Overlay Gradient for text readability (optional but recommended) */}
                    <LinearGradient
                        colors={['rgba(0,0,0,0.6)', 'transparent']}
                        style={styles.textOverlayGradient}
                    />

                    {/* Top Left: Date Overlay */}
                    <View style={styles.dateOverlay}>
                        <Text style={styles.overlayText}>{date.day}, {date.month}</Text>
                    </View>

                    {/* Top Right: Days Left Overlay */}
                    <View style={styles.daysLeftOverlay}>
                        <Text style={styles.overlayText}>{daysLeft} Days Left</Text>
                    </View>
                </View>

                {/* Bottom Section: Details */}
                <View style={styles.detailsContainer}>

                    {/* Left Column: Location & Stats */}
                    <View style={styles.leftDetails}>
                        <View style={styles.locationRow}>
                            <Ionicons name="location-sharp" size={20} color={Colors.elmo.accent} />
                            <Text style={styles.cityText}>{city}</Text>
                        </View>
                    </View>

                    {/* Right Column: Avatars */}
                    <View style={styles.rightDetails}>
                        <View style={styles.avatarsContainer}>
                            {friends.slice(0, 4).map((friend, index) => (
                                <View key={index} style={[styles.avatarCircle, { zIndex: 4 - index, marginLeft: index === 0 ? 0 : -8 }]}>
                                    <Image source={{ uri: friend }} style={styles.avatarImage} />
                                </View>
                            ))}
                        </View>
                    </View>

                </View>
            </View>

            {/* Outer Glow Effect (Centered, Behind Card) */}
            <View style={styles.glowContainer}>
                {/* 
                   We simulate the diffuse glow using a view with shadow properties 
                   that sits behind the main card or applying it to the container if possible.
                   Since 'elevation' on Android is limited, user approved the iOS shadow props.
                */}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginBottom: 20,
        // Centered Glow Implementation
        shadowColor: Colors.elmo.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5, // Android shadow fallback (black usually, but kept for depth)
    },
    card: {
        flexDirection: 'column',
        backgroundColor: '#0A1F1F', // Dark Teal
        borderRadius: 24,
        borderWidth: 1,
        borderColor: Colors.elmo.accent, // #2DD4BF
        overflow: 'hidden',
    },
    imageContainer: {
        width: '100%',
        height: 200,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    textOverlayGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 90, // Gradient only at the top
    },
    dateOverlay: {
        position: 'absolute',
        top: 16,
        left: 16,
    },
    daysLeftOverlay: {
        position: 'absolute',
        top: 16,
        right: 16,
    },
    overlayText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'regular',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 0,
    },
    detailsContainer: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftDetails: {
        flexDirection: 'column',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
    },
    cityText: {
        color: Colors.elmo.accent,
        fontSize: 22,
        fontWeight: 'regular',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    statText: {
        color: Colors.elmo.textSecondary,
        fontSize: 12,
        fontWeight: '500',
    },
    statSeparator: {
        color: Colors.elmo.textSecondary,
        fontSize: 12,
    },
    rightDetails: {
        justifyContent: 'center',
    },
    avatarsContainer: {
        flexDirection: 'row',
    },
    avatarCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#0A1F1F',
        overflow: 'hidden',
        backgroundColor: '#ccc',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    glowContainer: {
        // Placeholder if we needed a separate view for 'glow', 
        // but applying shadow directly to 'container' works best for iOS 'halo'.
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
    }
});
