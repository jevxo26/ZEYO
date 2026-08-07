import { Request, Response } from 'express';
import { SocialAuthService } from '../../services/authentication/socialAuthService';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

export class SocialAuthController {
  // Use catchAsync for consistency with the rest of the codebase
  static loginWithGoogle = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { credential } = req.body;

    if (!credential) {
      sendResponse(res, { statusCode: 400, message: 'Google credential is required' });
      return;
    }

    const result = await SocialAuthService.loginWithGoogle(credential);

    // Set HTTP-only refresh token cookie (same as regular login)
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    sendResponse(res, {
      statusCode: 200,
      message: 'Successfully logged in with Google',
      data: { user: result.user, token: result.token },
    });
  });

  static loginWithFacebook = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { accessToken } = req.body;

    if (!accessToken) {
      sendResponse(res, { statusCode: 400, message: 'Facebook access token is required' });
      return;
    }

    const result = await SocialAuthService.loginWithFacebook(accessToken);

    // Set HTTP-only refresh token cookie (same as regular login)
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    sendResponse(res, {
      statusCode: 200,
      message: 'Successfully logged in with Facebook',
      data: { user: result.user, token: result.token },
    });
  });
}
