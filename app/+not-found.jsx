import { useRouter } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Image, Text, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const NotFoundScreen = () => {
    const windowWidth = Dimensions.get('window').width;

    

    const router = useRouter();


    const goBack = () => {
        router.replace("/menu")
    };
    
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                
                <Image
                    source={require('../assets/not-found.png')}
                    style={styles.moduleIcon}
                    // resizeMode="contain"
                    width={100}
                    height={100}
                />
                {/* Error message */}
                <Text style={styles.title}>Page Not Found</Text>
                <Text style={styles.message}>
                    Oops! The page you're looking for doesn't exist or has been moved.
                </Text>

                {/* Navigation buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.outlineButton]}
                        onPress={goBack}
                    >
                        <Text style={styles.outlineButtonText}>Go Back</Text>
                    </TouchableOpacity>


                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    content: {
        alignItems: 'center',
        maxWidth: 400,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#111827',
        marginTop: 24,
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 32,
        textAlign: 'center',
        lineHeight: 24,
    },
    buttonContainer: {
        flexDirection: 'column',
        gap: 12,
        width: '100%',
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#6B7280',
    },
    primaryButton: {
        backgroundColor: '#3B82F6',
    },
    outlineButtonText: {
        color: '#6B7280',
        fontSize: 16,
        fontWeight: '600',
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    moduleIcon: {
        width: 300,
        height: 300,
        marginRight: 15,
      },
});

export default NotFoundScreen;