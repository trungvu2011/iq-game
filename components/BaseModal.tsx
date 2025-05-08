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
            animationType='slide'
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
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',

                    },
                    modelStyle,
                ]}>
                <View
                    onTouchEnd={(e) => e.stopPropagation()}
                    style={bodyStyle}
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