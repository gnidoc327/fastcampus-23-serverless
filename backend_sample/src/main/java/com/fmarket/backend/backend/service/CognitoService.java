package com.fmarket.backend.backend.service;

import com.fmarket.backend.entity.User;
import com.fmarket.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.*;
import software.amazon.awssdk.utils.ImmutableMap;

@Service
public class CognitoService {
    @Value("${aws.cognito.pool-id}")
    private final String userPoolId = "ap-northeast-2_RpPjjp3K4";

    @Value("${aws.cognito.client-id}")
    private final String clientId = "717jjl2nmt4upf1c60uj9v6976";

    @Autowired
    private UserRepository userRepository;

    private final CognitoIdentityProviderClient cognitoClient = CognitoIdentityProviderClient.builder().build();

    public SignUpResponse signUp(String username, String password) {
        userRepository.save(new User(username, password));
        SignUpRequest signUpRequest = SignUpRequest.builder()
                .clientId(clientId)
                .username(username)
                .password(password)
                .build();
        SignUpResponse signUpResponse = cognitoClient.signUp(signUpRequest);
        AdminConfirmSignUpRequest confirmSignUpRequest = AdminConfirmSignUpRequest.builder()
                .userPoolId(userPoolId)
                .username(username)
                .build();
        cognitoClient.adminConfirmSignUp(confirmSignUpRequest);
        return signUpResponse;
    }

    public String login(String username, String password) {
        CognitoIdentityProviderClient cognitoClient = CognitoIdentityProviderClient.builder().build();
        InitiateAuthRequest initiateAuthRequest = InitiateAuthRequest.builder()
                .authFlow(AuthFlowType.USER_PASSWORD_AUTH)
                .clientId(clientId)
                .authParameters(ImmutableMap.of(
                        "USERNAME", username,
                        "PASSWORD", password
                ))
                .build();

        InitiateAuthResponse initiateAuthResponse = cognitoClient.initiateAuth(initiateAuthRequest);

        if (initiateAuthResponse.authenticationResult() != null) {
            AuthenticationResultType authResult = initiateAuthResponse.authenticationResult();
            return authResult.accessToken();
        } else {
            throw new RuntimeException("Authentication failed.");
        }
    }

    public void logout(String accessToken) {
        CognitoIdentityProviderClient cognitoClient = CognitoIdentityProviderClient.builder().build();
        GlobalSignOutRequest globalSignOutRequest = GlobalSignOutRequest.builder()
                .accessToken(accessToken)
                .build();

        GlobalSignOutResponse globalSignOutResponse = cognitoClient.globalSignOut(globalSignOutRequest);

        if (!globalSignOutResponse.sdkHttpResponse().isSuccessful()) {
            // 로그아웃 실패 처리
            throw new RuntimeException("Logout failed.");
        }
    }
}
