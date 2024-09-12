# Scopes

This package is designed to give developers full control over its lifecycle, including the
initialization process. Therefore, there are no pre-initialized global scopes available for use;
developers must configure the scopes themselves.

By *scope*, we mean a union of related functionality into a single entity. For example, a scope
could be `backButton`, `mainButton`, `hapticFeedback`, etc. This approach makes the SDK usage more
intuitive and efficient.

To simplify the workflow, almost every scope (where applicable) provides a `mount` method, which
is responsible for configuring the scope state, adding special handlers, etc. After calling this
method, developers can be confident that the scope is in an up-to-date state.

To unmount the scope, use the `unmount` method.

If a scope is simple and doesn't require listeners or other handlers, a simpler method
like `restore` may be provided.

Be sure to read the documentation for each scope to understand how it works.