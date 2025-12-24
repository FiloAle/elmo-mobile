
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function TripHeader() {
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                {/* Placeholder for Logo - using Image for now, assuming it handles SVG or we use a replacement */}
                <Image
                    source={require('@/assets/images/Elmo logo.svg')}
                    style={styles.logo}
                    contentFit="contain"
                />
            </View>
            <View style={styles.profileContainer}>
                <View style={styles.profileAvatar}>
                    <Image
                        source={require('@/assets/images/profile image.jpeg')}
                        style={styles.avatarImage}
                        contentFit="cover"
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Logo is centered
        paddingHorizontal: 20,
        paddingTop: 60, // Safe area top
        paddingBottom: 20,
        backgroundColor: Colors.elmo.background,
        position: 'relative',
    },
    logoContainer: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 40,
    },
    profileContainer: {
        position: 'absolute',
        right: 20,
        top: 60, // Match paddingTop
    },
    profileAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.elmo.accent,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#2DD4BF',
    },
});
