class AppConfig {
  const AppConfig({
    required this.apiBaseUrl,
    required this.appName,
    required this.environment,
  });

  final String apiBaseUrl;
  final String appName;
  final String environment;

  static const current = AppConfig(
    apiBaseUrl: String.fromEnvironment(
      'API_BASE_URL',
      defaultValue: 'http://127.0.0.1:8080/api',
    ),
    appName: 'Teachmint++',
    environment: String.fromEnvironment('APP_ENV', defaultValue: 'development'),
  );
}
