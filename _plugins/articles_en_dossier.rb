# Un article en dossier (_articles/<nom>/index.md) sortirait à /articles/<nom>/index/.
# On lui donne /articles/<nom>/ avant tout rendu.
Jekyll::Hooks.register :site, :post_read do |site|
  site.collections["articles"].docs.each do |doc|
    next unless doc.basename_without_ext == "index"
    doc.data["permalink"] ||= "/articles/#{File.basename(File.dirname(doc.relative_path))}/"
  end
end
