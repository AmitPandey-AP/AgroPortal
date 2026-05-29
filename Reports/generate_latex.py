import re

def parse_md_to_latex(md_file_path, tex_file_path):
    with open(md_file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    latex = [
        r"\documentclass[12pt,a4paper]{report}",
        r"\usepackage[utf8]{inputenc}",
        r"\usepackage{geometry}",
        r"\geometry{top=1in, bottom=1in, left=1.25in, right=1in}",
        r"\usepackage{fancyhdr}",
        r"\usepackage{graphicx}",
        r"\usepackage{tabularx}",
        r"\usepackage{booktabs}",
        r"\usepackage{hyperref}",
        r"\usepackage{longtable}",
        r"\usepackage{titlesec}",
        r"",
        r"% Setup Headers and Footers",
        r"\pagestyle{fancy}",
        r"\fancyhf{}",
        r"\fancyhead[L]{AGROPORTAL: Intelligent AI Platform for Precision Agriculture}",
        r"\fancyfoot[L]{Dept. of CSE, IET Lucknow}",
        r"\fancyfoot[R]{Page No. \thepage}",
        r"\renewcommand{\footrulewidth}{0.4pt}",
        r"\renewcommand{\headrulewidth}{0.4pt}",
        r"",
        r"% Format Chapters like the images",
        r"\titleformat{\chapter}[display]",
        r"  {\normalfont\bfseries\centering}{}{0pt}{\Huge}",
        r"",
        r"\begin{document}",
        r"",
    ]
    
    in_table = False
    in_itemize = False
    in_codeblock = False

    for line in lines:
        line = line.strip()
        
        # Escape characters (ignoring ones inside code blocks for now)
        line = line.replace('%', r'\%')
        
        if line.startswith('```'):
            if in_codeblock:
                latex.append(r"\end{verbatim}")
                in_codeblock = False
            else:
                latex.append(r"\begin{verbatim}")
                in_codeblock = True
            continue
            
        if in_codeblock:
            latex.append(line)
            continue
            
        # Markdown Bold
        line = re.sub(r'\*\*(.*?)\*\*', r'\\textbf{\1}', line)
        # Markdown Inline code
        line = re.sub(r'`(.*?)`', r'\\texttt{\1}', line)
        
        if line.startswith('---'):
            latex.append(r"\newpage")
            continue
            
        # Headings
        if line.startswith('#'):
            level = len(line) - len(line.lstrip('#'))
            title = line.lstrip('#').strip()
            
            title = title.replace('&', r'\&')
            
            if level == 1:
                if 'CHAPTER' in title:
                    chapter_name = title.split(':', 1)[-1].strip() if ':' in title else title
                    latex.append(r"\chapter{" + chapter_name + r"}")
                else:
                    latex.append(r"\chapter*{" + title + r"}")
                    latex.append(r"\addcontentsline{toc}{chapter}{" + title + r"}")
            elif level == 2:
                latex.append(r"\section{" + title + r"}")
            elif level == 3:
                latex.append(r"\subsection{" + title + r"}")
            continue
            
        # Lists
        if line.startswith('- '):
            if not in_itemize:
                latex.append(r"\begin{itemize}")
                in_itemize = True
            li = line[2:].strip()
            li = li.replace('&', r'\&')
            latex.append(r"\item " + li)
            continue
        elif in_itemize and not line:
            latex.append(r"\end{itemize}")
            in_itemize = False
            continue
            
        # Tables
        if line.startswith('|') and line.endswith('|'):
            if not in_table:
                # new table
                cols = len([c for c in line.split('|') if c])
                latex.append(r"\begin{table}[h!]")
                latex.append(r"\centering")
                latex.append(f"\\begin{{tabular}}{{{'|l'*cols}|}}")
                latex.append(r"\hline")
                in_table = True
                
            # Process row
            cells = [c.strip().replace('&', r'\&').replace('_', r'\_').replace('#', r'\#') for c in line.split('|') if c]
            if not all(c.replace('-', '').strip() == '' for c in cells):
                latex.append(" & ".join(cells) + r" \\ \hline")
            continue
        elif in_table and not line.startswith('|'):
            latex.append(r"\end{tabular}")
            latex.append(r"\end{table}")
            in_table = False
            
        # Blockquotes
        if line.startswith('>'):
            latex.append(r"\begin{quote}")
            bq = line[1:].strip().replace('&', r'\&')
            latex.append(bq)
            latex.append(r"\end{quote}")
            continue
            
        if line:
            # Escape & for standard text blocks
            line = line.replace('&', r'\&').replace('_', r'\_').replace('#', r'\#')
            latex.append(line)
        else:
            latex.append("")

    if in_itemize:
        latex.append(r"\end{itemize}")
    if in_table:
        latex.append(r"\end{tabular}")
        latex.append(r"\end{table}")
        
    latex.append(r"\end{document}")

    with open(tex_file_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(latex))

if __name__ == "__main__":
    parse_md_to_latex(r"C:\Users\pande\Desktop\Major Project\Agriculture_Portal\PROJECT_REPORT.md", 
                     r"C:\Users\pande\Desktop\Major Project\Agriculture_Portal\AGROPORTAL_THESIS.tex")
