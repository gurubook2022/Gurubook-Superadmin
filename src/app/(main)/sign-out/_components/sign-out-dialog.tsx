"use client"
import React from 'react'
import { Button } from '@/components/ui/button';
import { useMutation } from '@apollo/client';
import { Modal } from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import { signOut } from 'next-auth/react';
import { LOGOUT } from '@/graphql/mutations';

const SignOutDialog = () => {
    const [logout, { loading }] = useMutation(LOGOUT);

    const handleLogout = async () => {

        logout({
            onCompleted: ({ logout }) => {
            },
            onError(error) { },
        });
        signOut({ callbackUrl: "/sign-in" });
    };
    return (

        <Modal
            size="sm"
            className=""
            isOpen={true}
            onClose={() => { }}
        >
            <div className="m-auto px-7 pt-6 pb-8 ">

                <div className="space-y-4">
                    <Text as="strong">Your session has been ended. Please log in again to continue.</Text>
                    <Button
                        type="submit"
                        size="lg"
                        color="danger"
                        className="w-full"
                        onClick={() => {
                            handleLogout()
                        }}
                    >
                        Sign In
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default SignOutDialog