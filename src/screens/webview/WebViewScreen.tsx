import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Platform, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { Colors } from '../../theme/colors';
import { check, request, PERMISSIONS, RESULTS, Permission } from 'react-native-permissions';

type WebViewScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'WebView'>;

interface JWTResponse {
    status: string;
    message: string;
    token: string;
    url: string;
}

export const WebViewScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<WebViewScreenNavigationProp>();
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [key, setKey] = React.useState(0);
    const [jwtToken, setJwtToken] = React.useState<string | null>(null);
    const [permissionsGranted, setPermissionsGranted] = React.useState(false);
    const webViewRef = React.useRef<WebView>(null);

    const baseUrl = 'https://oan-ui-service-goodworks.onrender.com';
    const webViewUrl = jwtToken ? `${baseUrl}?token=${jwtToken}` : baseUrl;

    // Request permissions
    const requestPermissions = async () => {
        try {
            const microphonePermission: Permission = Platform.select({
                ios: PERMISSIONS.IOS.MICROPHONE,
                android: PERMISSIONS.ANDROID.RECORD_AUDIO,
            }) as Permission;

            const locationPermission: Permission = Platform.select({
                ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
                android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            }) as Permission;

            // Request microphone permission
            const micResult = await request(microphonePermission);
            console.log('Microphone permission:', micResult);

            // Request location permission
            const locResult = await request(locationPermission);
            console.log('Location permission:', locResult);

            // Check if both permissions are granted
            if (
                (micResult === RESULTS.GRANTED || micResult === RESULTS.LIMITED) &&
                (locResult === RESULTS.GRANTED || locResult === RESULTS.LIMITED)
            ) {
                setPermissionsGranted(true);
                return true;
            } else {
                // Show alert if permissions are denied
                Alert.alert(
                    'Permissions Required',
                    'Microphone and location permissions are required for the chat to work properly. Some features may not be available.',
                    [
                        {
                            text: 'OK',
                            onPress: () => setPermissionsGranted(true), // Allow to continue anyway
                        },
                    ]
                );
                return false;
            }
        } catch (err) {
            console.error('Permission request error:', err);
            setPermissionsGranted(true); // Allow to continue anyway
            return false;
        }
    };

    // Request permissions and fetch JWT token on component mount
    React.useEffect(() => {
        const initializeScreen = async () => {
            try {
                setLoading(true);

                // Request permissions first
                await requestPermissions();

                // Then fetch JWT token
                const response = await fetch('https://vistaar.maharashtra.gov.in/jwt-token-url.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        mobile: '9049502125',
                        name: 'Vishal Borade',
                        role: 'public',
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: JWTResponse = await response.json();

                if (data.status === 'success' && data.token) {
                    setJwtToken(data.token);
                    setError(null);
                } else {
                    throw new Error('Failed to get JWT token');
                }
            } catch (err) {
                console.error('JWT Token Error:', err);
                setError('Failed to authenticate. Please try again.');
                setLoading(false);
            }
        };

        initializeScreen();
    }, []);

    const handleError = (event: any) => {
        console.error('WebView Error:', event.nativeEvent);
        setLoading(false);
        setError(`Failed to load page: ${event.nativeEvent.description || 'Unknown error'}`);
    };

    const handleHttpError = (event: any) => {
        console.error('WebView HTTP Error:', event.nativeEvent);
        const statusCode = event.nativeEvent.statusCode;
        setLoading(false);

        if (statusCode === 404) {
            setError('Chat service not found. The server may be unavailable.');
        } else if (statusCode >= 500) {
            setError('Server error. Please try again later.');
        } else {
            setError(`HTTP Error ${statusCode}: Unable to load chat.`);
        }
    };

    const handleRetry = async () => {
        setError(null);
        setLoading(true);
        setKey(prevKey => prevKey + 1);

        // Request permissions and refetch JWT token
        try {
            // Request permissions first
            await requestPermissions();

            const response = await fetch('https://vistaar.maharashtra.gov.in/jwt-token-url.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mobile: '9049502125',
                    name: 'Vishal Borade',
                    role: 'public',
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: JWTResponse = await response.json();

            if (data.status === 'success' && data.token) {
                setJwtToken(data.token);
            } else {
                throw new Error('Failed to get JWT token');
            }
        } catch (err) {
            console.error('JWT Token Error:', err);
            setError('Failed to authenticate. Please try again.');
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            {/* Header with Back Button */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        onPress={handleGoBack}
                        style={styles.backButton}
                    >
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Chat</Text>
                </View>
            </View>

            {/* WebView */}
            <View style={styles.webViewContainer}>
                {loading && !error && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color={Colors.brand.primary} />
                        <Text style={styles.loadingText}>Loading chat...</Text>
                    </View>
                )}

                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorIcon}>⚠️</Text>
                        <Text style={styles.errorTitle}>Unable to Load Chat</Text>
                        <Text style={styles.errorMessage}>{error}</Text>
                        <View style={styles.errorButtons}>
                            <TouchableOpacity
                                style={styles.retryButton}
                                onPress={handleRetry}
                            >
                                <Text style={styles.retryButtonText}>Retry</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.backButtonError}
                                onPress={handleGoBack}
                            >
                                <Text style={styles.backButtonErrorText}>Go Back</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {!error && permissionsGranted && (
                    <WebView
                        key={key}
                        ref={webViewRef}
                        source={{ uri: webViewUrl }}
                        onLoadStart={() => setLoading(true)}
                        onLoadEnd={() => setLoading(false)}
                        onError={handleError}
                        onHttpError={handleHttpError}
                        style={styles.webView}
                        startInLoadingState={true}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        scalesPageToFit={true}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={true}
                        scrollEnabled={true}
                        bounces={true}
                        mediaPlaybackRequiresUserAction={false}
                        allowsInlineMediaPlayback={true}
                        geolocationEnabled={true}
                        injectedJavaScriptBeforeContentLoaded={`
                            window.addEventListener('DOMContentLoaded', function() {
                                // Remove existing viewport meta tags
                                const existingMeta = document.querySelector('meta[name="viewport"]');
                                if (existingMeta) {
                                    existingMeta.remove();
                                }

                                // Add new viewport meta tag
                                const meta = document.createElement('meta');
                                meta.setAttribute('name', 'viewport');
                                meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=yes');
                                document.getElementsByTagName('head')[0].appendChild(meta);
                            });
                        `}
                        injectedJavaScript={`
                            (function() {
                                // Remove existing viewport meta tags
                                const existingMeta = document.querySelector('meta[name="viewport"]');
                                if (existingMeta) {
                                    existingMeta.remove();
                                }

                                // Add new viewport meta tag
                                const meta = document.createElement('meta');
                                meta.setAttribute('name', 'viewport');
                                meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=yes');
                                document.getElementsByTagName('head')[0].appendChild(meta);

                                // Add comprehensive CSS to constrain content
                                const style = document.createElement('style');
                                style.innerHTML = \`
                                    html, body {
                                        overflow-x: hidden !important;
                                        max-width: 100vw !important;
                                        width: 100vw !important;
                                        margin: 0 !important;
                                        padding: 0 !important;
                                        box-sizing: border-box !important;
                                    }

                                    * {
                                        max-width: 100% !important;
                                        box-sizing: border-box !important;
                                    }

                                    img, video, iframe {
                                        max-width: 100% !important;
                                        height: auto !important;
                                    }

                                    /* Target common container classes */
                                    div, section, article, main, aside {
                                        max-width: 100% !important;
                                        overflow-x: hidden !important;
                                    }

                                    /* Prevent horizontal scroll */
                                    ::-webkit-scrollbar:horizontal {
                                        display: none !important;
                                    }
                                \`;
                                document.getElementsByTagName('head')[0].appendChild(style);

                                // Force reflow
                                document.body.style.width = '100vw';
                                document.documentElement.style.width = '100vw';

                                true;
                            })();
                        `}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        backgroundColor: Colors.brand.primary,
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 12,
        padding: 8,
    },
    backButtonText: {
        color: Colors.white,
        fontSize: 20,
    },
    headerTitle: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    webViewContainer: {
        flex: 1,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
        zIndex: 10,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: Colors.text.secondary,
    },
    webView: {
        flex: 1,
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        backgroundColor: Colors.white,
    },
    errorIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text.primary,
        marginBottom: 8,
        textAlign: 'center',
    },
    errorMessage: {
        fontSize: 14,
        color: Colors.text.secondary,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    errorButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    retryButton: {
        backgroundColor: Colors.brand.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    retryButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    backButtonError: {
        backgroundColor: Colors.white,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.brand.primary,
    },
    backButtonErrorText: {
        color: Colors.brand.primary,
        fontSize: 16,
        fontWeight: '600',
    },
});

