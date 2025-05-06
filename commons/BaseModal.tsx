import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
    Modal,
    ModalProps,
    StatusBar,
    TouchableOpacity,
    View,
    ViewProps,
    ViewStyle,
} from 'react-native';

export interface BaseModalRefType {
    show: () => void;
    hide: () => void;
}

export interface BaseModalProps extends Omit<ModalProps, 'ref'> {
    children: React.ReactNode;
    bodyStyle?: ViewStyle;
    showCloseButton?: boolean;
    touchOutsideToHide?: boolean;
    modelStyle?: ViewStyle;
    bodyProps?: ViewProps;
    transparent?: boolean;
    onRequestClose?: () => void;
}

const BaseModal = forwardRef<BaseModalRefType, BaseModalProps>(({
    children,
    bodyStyle,
    showCloseButton = true,
    touchOutsideToHide = false,
    modelStyle,
    bodyProps,
    transparent = true,
    onRequestClose,
    ...rest
}, ref) => {
    const [showModal, setShowModal] = useState(false);

    useImperativeHandle(ref, () => ({
        show: () => setShowModal(true),
        hide: () => setShowModal(false),
    }));

    return (
        <Modal
            transparent={transparent}
            visible={showModal}
            statusBarTranslucent
            animationType='fade'
            onRequestClose={
                onRequestClose ? onRequestClose : () => setShowModal(false)
            }
            {...rest}>
            <View
                onTouchEnd={(e) => {
                    if (touchOutsideToHide) {
                        e.stopPropagation();
                        setShowModal(false);
                    }
                }}
                style={[
                    {
                        padding: 8,
                        position: 'absolute',
                        right: 15,
                        top: StatusBar.currentHeight || 0,
                        backgroundColor: '#00000090',
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',

                    },
                    modelStyle,
                ]}>
                <View
                    onTouchEnd={(e) => e.stopPropagation()}
                    style={[
                        {
                            minHeight: 100,
                            padding: 20,
                            borderRadius: 10,
                            width: '80%',
                            maxWidth: 400,
                            alignSelf: 'center',
                        },
                        bodyStyle,
                        !transparent && {
                            backgroundColor: '#FFFFFF',
                        },
                    ]}
                    {...bodyProps}>
                    {showCloseButton && (
                        <TouchableOpacity
                            onPress={() => {
                                setShowModal(false);
                            }}
                            style={{
                                padding: 8,
                                position: 'absolute',
                                right: 15,
                                top: 15,
                                backgroundColor: '#88888888',
                                borderRadius: 100,
                                zIndex: 1,
                            }}>
                        </TouchableOpacity>
                    )}
                    {children}
                </View>
            </View>
        </Modal>
    );
});

export default BaseModal;