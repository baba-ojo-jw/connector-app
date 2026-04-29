"""
Generate the Connector architecture diagram using Graphviz.
Output: docs/architecture.png
"""

import graphviz

dot = graphviz.Digraph(
    'Connector Architecture',
    format='png',
    engine='dot',
    graph_attr={
        'bgcolor': '#1a1a2e',
        'fontcolor': 'white',
        'fontname': 'Helvetica Neue',
        'fontsize': '14',
        'rankdir': 'TB',
        'splines': 'true',
        'nodesep': '1.2',
        'ranksep': '1.5',
        'pad': '1.0',
        'dpi': '150',
        'overlap': 'false',
        'forcelabels': 'true',
        'compound': 'true',
    },
    node_attr={
        'fontname': 'Helvetica Neue',
        'fontsize': '13',
        'fontcolor': 'white',
        'style': 'filled,rounded',
        'shape': 'box',
        'penwidth': '0',
        'margin': '0.35,0.2',
    },
    edge_attr={
        'fontname': 'Helvetica Neue',
        'fontsize': '10',
        'fontcolor': '#cccccc',
        'color': '#555555',
        'penwidth': '1.8',
        'arrowsize': '0.9',
    }
)

# ─── User node ───────────────────────────────────────────
dot.node('user', 'User\n(Browser / Mobile App)',
         fillcolor='#2d2d44', fontcolor='white',
         shape='box', style='filled,rounded',
         width='3.5', height='0.8')

# ─── Authentication Service (red) ────────────────────────
with dot.subgraph(name='cluster_auth') as c:
    c.attr(
        label='  Authentication Service  ',
        style='filled,rounded',
        color='#e74c3c',
        fillcolor='#c0392b',
        fontcolor='white',
        fontname='Helvetica Neue Bold',
        fontsize='14',
        penwidth='2',
        margin='25',
    )
    c.node('auth_login', 'Login Endpoint', fillcolor='#2d2d44', width='2.2')
    c.node('auth_session', 'Session Manager', fillcolor='#2d2d44', width='2.2')
    c.edge('auth_login', 'auth_session',
           xlabel='Create / validate token',
           style='dashed', color='#ff6b6b')

# ─── Frontend (blue) ─────────────────────────────────────
with dot.subgraph(name='cluster_frontend') as c:
    c.attr(
        label='  Frontend  ',
        style='filled,rounded',
        color='#3498db',
        fillcolor='#2980b9',
        fontcolor='white',
        fontname='Helvetica Neue Bold',
        fontsize='14',
        penwidth='2',
        margin='25',
    )
    c.node('fe_profile', 'Profile Page', fillcolor='#2d2d44', width='2.2')
    c.node('fe_errors', 'Error Handler', fillcolor='#2d2d44', width='2.2')

# ─── Admin Panel (gray) ──────────────────────────────────
with dot.subgraph(name='cluster_admin') as c:
    c.attr(
        label='  Admin Panel  ',
        style='filled,rounded',
        color='#95a5a6',
        fillcolor='#7f8c8d',
        fontcolor='white',
        fontname='Helvetica Neue Bold',
        fontsize='14',
        penwidth='2',
        margin='25',
    )
    c.node('admin_login', 'Admin Login', fillcolor='#2d2d44', width='2.2')
    c.node('admin_deps', 'Dependencies', fillcolor='#2d2d44', width='2.2')

# ─── Backend API (orange) ────────────────────────────────
with dot.subgraph(name='cluster_api') as c:
    c.attr(
        label='  Backend API  ',
        style='filled,rounded',
        color='#f39c12',
        fillcolor='#e67e22',
        fontcolor='white',
        fontname='Helvetica Neue Bold',
        fontsize='14',
        penwidth='2',
        margin='25',
    )
    c.node('api_messages', 'Direct Messages', fillcolor='#2d2d44', width='2.2')
    c.node('api_upload', 'File Upload', fillcolor='#2d2d44', width='2')
    c.node('api_search', 'Search', fillcolor='#2d2d44', width='2')

# ─── Payment Processor (purple) ──────────────────────────
with dot.subgraph(name='cluster_payments') as c:
    c.attr(
        label='  Payment Processor  ',
        style='filled,rounded',
        color='#9b59b6',
        fillcolor='#8e44ad',
        fontcolor='white',
        fontname='Helvetica Neue Bold',
        fontsize='14',
        penwidth='2',
        margin='25',
    )
    c.node('pay_handler', 'Transaction Handler', fillcolor='#2d2d44', width='2.5')

# ─── Database (green) ────────────────────────────────────
with dot.subgraph(name='cluster_db') as c:
    c.attr(
        label='  Database  ',
        style='filled,rounded',
        color='#2ecc71',
        fillcolor='#27ae60',
        fontcolor='white',
        fontname='Helvetica Neue Bold',
        fontsize='14',
        penwidth='2',
        margin='25',
    )
    c.node('db_queries', 'Query Engine', fillcolor='#2d2d44', width='2.2')
    c.node('db_users', 'User Records', fillcolor='#2d2d44', width='2.2')
    c.edge('db_queries', 'db_users',
           xlabel='Read / write',
           style='dashed', color='#54d98c')

# ─── Edges (spread across different target nodes) ────────

# User → services
dot.edge('user', 'auth_login',
         xlabel='Login / Signup', color='#e74c3c')
dot.edge('user', 'fe_profile',
         xlabel='HTTP requests', color='#3498db')

# Auth → API
dot.edge('auth_session', 'api_messages',
         xlabel='Token check on\nevery request',
         style='dashed', color='#e74c3c')

# Frontend → API (point to upload to spread load)
dot.edge('fe_profile', 'api_upload',
         xlabel='REST API calls', color='#3498db')

# Admin → API (point to search to spread load)
dot.edge('admin_login', 'api_search',
         xlabel='Staff-only access',
         style='dashed', color='#95a5a6')

# API → Database (each to db_queries)
dot.edge('api_messages', 'db_queries',
         xlabel='Read / write\nmessages', color='#f39c12')
dot.edge('api_upload', 'db_queries',
         xlabel='Store metadata', color='#f39c12')
dot.edge('api_search', 'db_queries',
         xlabel='Query data', color='#f39c12')

# API → Payments
dot.edge('api_upload', 'pay_handler',
         xlabel='Process\npayments', color='#9b59b6')

# Payments → Database
dot.edge('pay_handler', 'db_queries',
         xlabel='Store transactions', color='#9b59b6')

# ─── Render ──────────────────────────────────────────────
output_path = dot.render(
    filename='architecture',
    directory='/Users/babatundeojo/Documents/FutureReady/connector-app/docs',
    cleanup=True
)
print(f'Diagram saved to: {output_path}')
